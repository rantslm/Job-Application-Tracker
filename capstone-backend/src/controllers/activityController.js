const db = require('../../models');
// Get all activities for the authenticated user
exports.getAllActivities = async (req, res) => {
  try {
    const activities = await db.Activity.findAll({
      include: [
        {
          model: db.Application,
          as: 'application',
          where: { user_id: req.user.id },
          attributes: ['id', 'company_name', 'position_title'],
        },
        {
          model: db.Contact,
          as: 'contact',
          attributes: ['id', 'name', 'title', 'contact_type'],
          required: false,
        },
      ],
      order: [['occurred_at', 'DESC']],
    });

    res.status(200).json(activities);
  } catch (error) {
    console.error('Error fetching all activities:', error);
    res.status(500).json({ error: 'Failed to fetch activities' });
  }
};

/**
 * Get all activities for a specific application.
 */
exports.getActivitiesByApplication = async (req, res) => {
  try {
    const application = await db.Application.findOne({
      where: {
        id: req.params.applicationId,
        user_id: req.user.id,
      },
    });

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    const activities = await db.Activity.findAll({
      where: { application_id: req.params.applicationId },
      include: [
        {
          model: db.Contact,
          as: 'contact',
          attributes: ['id', 'name', 'title', 'contact_type'],
          required: false,
        },
      ],
      order: [['occurred_at', 'DESC']],
    });

    res.status(200).json(activities);
  } catch (error) {
    console.error('Error fetching activities:', error);
    res.status(500).json({ error: 'Failed to fetch activities' });
  }
};

/**
 * Create a new activity for a specific application.
 */
exports.createActivity = async (req, res) => {
  try {
    const application = await db.Application.findOne({
      where: {
        id: req.params.applicationId,
        user_id: req.user.id,
      },
    });

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    if (req.body.contact_id) {
      const contact = await db.Contact.findOne({
        where: {
          id: req.body.contact_id,
          application_id: req.params.applicationId,
        },
        include: [
          {
            model: db.Application,
            as: 'application',
            where: { user_id: req.user.id },
          },
        ],
      });

      if (!contact) {
        return res.status(400).json({
          error: 'Selected contact is invalid for this application',
        });
      }
    }

    const newActivity = await db.Activity.create({
      application_id: req.params.applicationId,
      contact_id: req.body.contact_id || null,
      type: req.body.type,
      occurred_at: req.body.occurred_at,
      summary: req.body.summary,
      details: req.body.details,
    });

    const createdActivity = await db.Activity.findByPk(newActivity.id, {
      include: [
        {
          model: db.Application,
          as: 'application',
          attributes: ['id', 'company_name', 'position_title'],
        },
        {
          model: db.Contact,
          as: 'contact',
          attributes: ['id', 'name', 'title', 'contact_type'],
          required: false,
        },
      ],
    });

    res.status(201).json(createdActivity);
  } catch (error) {
    console.error('Error creating activity:', error);
    res.status(500).json({ error: 'Failed to create activity' });
  }
};

/**
 * Update an activity.
 */
exports.updateActivity = async (req, res) => {
  try {
    const activity = await db.Activity.findByPk(req.params.id, {
      include: {
        model: db.Application,
        as: 'application',
      },
    });

    if (
      !activity ||
      !activity.application ||
      activity.application.user_id !== req.user.id
    ) {
      return res.status(404).json({ error: 'Activity not found' });
    }

    if (req.body.contact_id) {
      const contact = await db.Contact.findOne({
        where: {
          id: req.body.contact_id,
          application_id: activity.application_id,
        },
        include: [
          {
            model: db.Application,
            as: 'application',
            where: { user_id: req.user.id },
          },
        ],
      });

      if (!contact) {
        return res.status(400).json({
          error: 'Selected contact is invalid for this application',
        });
      }
    }

    await activity.update({
      contact_id:
        req.body.contact_id === '' || req.body.contact_id === undefined
          ? activity.contact_id
          : req.body.contact_id || null,
      type: req.body.type,
      occurred_at: req.body.occurred_at,
      summary: req.body.summary,
      details: req.body.details,
    });

    const updatedActivity = await db.Activity.findByPk(activity.id, {
      include: [
        {
          model: db.Application,
          as: 'application',
          attributes: ['id', 'company_name', 'position_title'],
        },
        {
          model: db.Contact,
          as: 'contact',
          attributes: ['id', 'name', 'title', 'contact_type'],
          required: false,
        },
      ],
    });

    res.status(200).json(updatedActivity);
  } catch (error) {
    console.error('Error updating activity:', error);
    res.status(500).json({ error: 'Failed to update activity' });
  }
};

/**
 * Delete an activity.
 */
exports.deleteActivity = async (req, res) => {
  try {
    const activity = await db.Activity.findByPk(req.params.id, {
      include: {
        model: db.Application,
        as: 'application',
      },
    });

    if (
      !activity ||
      !activity.application ||
      activity.application.user_id !== req.user.id
    ) {
      return res.status(404).json({ error: 'Activity not found' });
    }

    await activity.destroy();

    res.status(200).json({ message: 'Activity deleted successfully' });
  } catch (error) {
    console.error('Error deleting activity:', error);
    res.status(500).json({ error: 'Failed to delete activity' });
  }
};
