const service = require('../services/interviewService');

const handle = (promise, res, status = 200) => promise
  .then((data) => res.status(status).json(data))
  .catch((error) => res.status(error.message.includes('not found') ? 404 : 400).json({ message: error.message }));

exports.create = (req, res) => handle(service.createInterview(req.body, req.user, req.userRole).then((data) => ({ interview: data })), res, 201);
exports.list = (req, res) => handle(service.listInterviews(req.user, req.userRole).then((interviews) => ({ interviews })), res);
exports.get = (req, res) => handle(service.getInterview(req.params.id, req.user).then((interview) => ({ interview })), res);
exports.update = (req, res) => handle(service.updateInterview(req.params.id, req.body, req.user).then((interview) => ({ interview })), res);
exports.cancel = (req, res) => handle(service.cancelInterview(req.params.id, req.user).then((interview) => ({ interview })), res);
