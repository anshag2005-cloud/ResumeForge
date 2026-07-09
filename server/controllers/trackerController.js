const JobApplication = require('../models/JobApplication');

const createApplication = async (req, res) => {
  try {
    const { company, role, status, notes, salary } = req.body;

    if (global.dbMode === 'mock') {
      const newApp = {
        _id: 'mock_app_' + Date.now(),
        userId: req.user.id,
        company,
        role,
        status: status || 'Applied',
        notes: notes || '',
        salary: salary || '',
        bookmarked: false,
        appliedAt: new Date()
      };
      global.mockDB.applications.push(newApp);

      return res.status(201).json({
        id: newApp._id,
        user_id: newApp.userId,
        company: newApp.company,
        role: newApp.role,
        status: newApp.status,
        notes: newApp.notes,
        salary: newApp.salary,
        bookmarked: newApp.bookmarked,
        applied_at: newApp.appliedAt
      });
    }

    const newApp = new JobApplication({
      userId: req.user.id,
      company,
      role,
      status: status || 'Applied',
      notes: notes || '',
      salary: salary || '',
      bookmarked: false
    });

    await newApp.save();

    res.status(201).json({
      id: newApp._id,
      user_id: newApp.userId,
      company: newApp.company,
      role: newApp.role,
      status: newApp.status,
      notes: newApp.notes,
      salary: newApp.salary,
      bookmarked: newApp.bookmarked,
      applied_at: newApp.appliedAt
    });
  } catch (error) {
    res.status(500).json({ detail: error.message });
  }
};

const getApplications = async (req, res) => {
  try {
    if (global.dbMode === 'mock') {
      const apps = global.mockDB.applications.filter(app => app.userId === req.user.id);
      
      // Map to client format
      const mapped = apps.map(app => ({
        id: app._id,
        user_id: app.userId,
        company: app.company,
        role: app.role,
        status: app.status,
        notes: app.notes,
        salary: app.salary,
        bookmarked: app.bookmarked,
        applied_at: app.appliedAt
      }));
      return res.json(mapped);
    }

    const apps = await JobApplication.find({ userId: req.user.id }).sort({ appliedAt: -1 });
    
    // Map to client format
    const mapped = apps.map(app => ({
      id: app._id,
      user_id: app.userId,
      company: app.company,
      role: app.role,
      status: app.status,
      notes: app.notes,
      salary: app.salary,
      bookmarked: app.bookmarked,
      applied_at: app.appliedAt
    }));

    res.json(mapped);
  } catch (error) {
    res.status(500).json({ detail: error.message });
  }
};

const updateApplication = async (req, res) => {
  try {
    if (global.dbMode === 'mock') {
      const app = global.mockDB.applications.find(a => a._id === req.params.id && a.userId === req.user.id);
      if (!app) {
        return res.status(404).json({ detail: 'Application tracker entry not found' });
      }

      const fieldsToUpdate = req.body;
      Object.keys(fieldsToUpdate).forEach(key => {
        app[key] = fieldsToUpdate[key];
      });

      return res.json({
        id: app._id,
        user_id: app.userId,
        company: app.company,
        role: app.role,
        status: app.status,
        notes: app.notes,
        salary: app.salary,
        bookmarked: app.bookmarked,
        applied_at: app.appliedAt
      });
    }

    const app = await JobApplication.findOne({ _id: req.params.id, userId: req.user.id });
    if (!app) {
      return res.status(404).json({ detail: 'Application tracker entry not found' });
    }

    const fieldsToUpdate = req.body;
    Object.keys(fieldsToUpdate).forEach(key => {
      app[key] = fieldsToUpdate[key];
    });

    await app.save();

    res.json({
      id: app._id,
      user_id: app.userId,
      company: app.company,
      role: app.role,
      status: app.status,
      notes: app.notes,
      salary: app.salary,
      bookmarked: app.bookmarked,
      applied_at: app.appliedAt
    });
  } catch (error) {
    res.status(500).json({ detail: error.message });
  }
};

const deleteApplication = async (req, res) => {
  try {
    if (global.dbMode === 'mock') {
      const idx = global.mockDB.applications.findIndex(a => a._id === req.params.id && a.userId === req.user.id);
      if (idx === -1) {
        return res.status(404).json({ detail: 'Application tracker entry not found' });
      }
      global.mockDB.applications.splice(idx, 1);
      return res.status(204).json(null);
    }

    const app = await JobApplication.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!app) {
      return res.status(404).json({ detail: 'Application tracker entry not found' });
    }
    res.status(204).json(null);
  } catch (error) {
    res.status(500).json({ detail: error.message });
  }
};

module.exports = {
  createApplication,
  getApplications,
  updateApplication,
  deleteApplication
};
