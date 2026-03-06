'use strict';

module.exports = {

  /**
   * The "up" function runs when we execute:
   * npx sequelize-cli db:seed:all
   *
   * It inserts demo data into the database so the application
   * has content for development and demonstration.
   */
  async up(queryInterface, Sequelize) {

    // USERS
    // Insert a demo user. In the real application user will register through the authentication system.
    await queryInterface.bulkInsert('Users', [
      {
        email: 'demo@example.com',
        password_hash: 'demo_password_hash', // placeholder until bcrypt auth is implemented
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);


    // APPLICATIONS
    // These represent job applications belonging to user_id = 1.
    // Applications are the main parent entity for contacts, activities, and tasks.
    await queryInterface.bulkInsert('Applications', [
      {
        user_id: 1,
        company_name: 'Google',
        position_title: 'UX Designer',
        stage: 'Applied',
        location: 'Remote',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        user_id: 1,
        company_name: 'Apple',
        position_title: 'Product Designer',
        stage: 'Interviewing',
        location: 'Cupertino',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        user_id: 1,
        company_name: 'Spotify',
        position_title: 'Frontend Engineer',
        stage: 'Saved',
        location: 'Remote',
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);


    // CONTACTS
    // Contacts represent recruiters, hiring managers, or interviewers associated with an application.
    await queryInterface.bulkInsert('Contacts', [
      {
        application_id: 1,
        name: 'Sarah Kim',
        title: 'Recruiter',
        contact_type: 'Recruiter',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        application_id: 2,
        name: 'David Chen',
        title: 'Hiring Manager',
        contact_type: 'HiringManager',
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);

    // ACTIVITIES
    // Activities track communication history related to an application such as emails, calls, interviews, or general notes.
    await queryInterface.bulkInsert('Activities', [
      {
        application_id: 1,
        type: 'Email',
        occurred_at: new Date(),
        summary: 'Recruiter outreach',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        application_id: 2,
        type: 'Interview',
        occurred_at: new Date(),
        summary: 'First round interview',
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);

    // TASKS
    // Tasks represent reminders or follow-up actions related to a specific application.
    await queryInterface.bulkInsert('Tasks', [
      {
        application_id: 1,
        title: 'Send follow up email',
        status: 'Open',
        due_at: new Date(),
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },


  /**
   * The "down" function reverses the seed.
   * It runs when executing:
   * npx sequelize-cli db:seed:undo:all
   *
   * This deletes all seeded data so the database
   * can be reset to a clean state.
   */
  async down(queryInterface, Sequelize) {

    // Delete records in reverse dependency order to avoid foreign key constraint errors.

    await queryInterface.bulkDelete('Tasks', null, {});
    await queryInterface.bulkDelete('Activities', null, {});
    await queryInterface.bulkDelete('Contacts', null, {});
    await queryInterface.bulkDelete('Applications', null, {});
    await queryInterface.bulkDelete('Users', null, {});
  }
};
