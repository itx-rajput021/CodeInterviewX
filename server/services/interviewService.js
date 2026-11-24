const mongoose = require('mongoose');
const Interview = require('../models/Interview');
const demoStore = require('../config/demoStore');

const isMongoReady = () => mongoose.connection.readyState === 1;
const makeRoomCode = () => Math.random().toString(36).slice(2, 8).toUpperCase();

const serialize = (item) => {
  const plain = item.toObject ? item.toObject() : { ...item };
  return { ...plain, id: String(plain._id || plain.id) };
};

const createInterview = async (body, user) => {
  if (!body.title?.trim() || !body.candidateName?.trim() || !body.scheduledAt) {
    throw new Error('Title, candidate name and scheduled time are required');
  }
  const record = {
    title: body.title.trim(),
    description: body.description?.trim() || '',
    candidateId: body.candidateId || `candidate-${demoStore.createId()}`,
    candidateName: body.candidateName.trim(),
    interviewerId: user.userId,
    interviewerName: body.interviewerName || '',
    scheduledAt: new Date(body.scheduledAt),
    durationMinutes: Number(body.durationMinutes) || 60,
    status: 'scheduled',
    roomCode: makeRoomCode(),
    initialCode: body.initialCode || '// Write your solution here\n',
    language: body.language || 'javascript',
  };
  if (Number.isNaN(record.scheduledAt.getTime())) throw new Error('Invalid scheduled time');

  if (!isMongoReady()) {
    const created = { id: demoStore.createId(), ...record, createdAt: new Date(), updatedAt: new Date() };
    demoStore.interviews.unshift(created);
    return created;
  }
  return serialize(await Interview.create(record));
};

const listInterviews = async (user, role) => {
  if (!isMongoReady()) {
    const items = demoStore.interviews.filter((item) =>
      role === 'interviewer'
        ? item.interviewerId === user.userId
        : item.candidateId === user.userId || item.candidateName === user.name
    );
    return items;
  }
  const query = role === 'interviewer'
    ? { interviewerId: user.userId }
    : { $or: [{ candidateId: user.userId }, { candidateName: user.name }] };
  const items = await Interview.find(query).sort({ scheduledAt: 1 });
  return items.map(serialize);
};

const getInterview = async (id, user) => {
  let item;
  if (!isMongoReady()) {
    item = demoStore.interviews.find((record) => record.id === id);
  } else {
    item = await Interview.findById(id).catch(() => null);
  }
  if (!item) throw new Error('Interview not found');
  const plain = serialize(item);
  if (plain.interviewerId !== user.userId && plain.candidateId !== user.userId) {
    throw new Error('You do not have access to this interview');
  }
  return plain;
};

const updateInterview = async (id, body, user) => {
  let item;
  if (!isMongoReady()) {
    item = demoStore.interviews.find((record) => record.id === id);
  } else {
    item = await Interview.findById(id).catch(() => null);
  }
  if (!item) throw new Error('Interview not found');
  const plain = serialize(item);
  if (plain.interviewerId !== user.userId) throw new Error('Only the interviewer can update this interview');

  const allowed = ['title', 'description', 'scheduledAt', 'durationMinutes', 'status', 'initialCode', 'language'];
  for (const key of allowed) {
    if (body[key] !== undefined) item[key] = key === 'scheduledAt' ? new Date(body[key]) : body[key];
  }
  item.updatedAt = new Date();

  if (!isMongoReady()) return item;
  await item.save();
  return serialize(item);
};

const cancelInterview = async (id, user) => updateInterview(id, { status: 'cancelled' }, user);

module.exports = { createInterview, listInterviews, getInterview, updateInterview, cancelInterview };
