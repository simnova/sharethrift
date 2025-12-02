Feature: SendGrid Email Service
  As a developer
  I want to send emails using SendGrid
  So that I can communicate with users

  Scenario: Constructing SendGrid with missing API key
    Given no SENDGRID_API_KEY environment variable
    When SendGrid is constructed
    Then it should throw an error about missing API key

  Scenario: Constructing SendGrid with valid API key
    Given a valid SENDGRID_API_KEY environment variable
    And an email template name
    When SendGrid is constructed
    Then it should initialize with the template name

  Scenario: Sending email with magic link in development mode
    Given a SendGrid instance in development mode
    And a user email and magic link
    When sendEmailWithMagicLink is called
    Then it should save the email to a file instead of sending

  Scenario: Sending email with magic link in production mode
    Given a SendGrid instance in production mode
    And a user email and magic link
    When sendEmailWithMagicLink is called
    Then it should send email via SendGrid API

  Scenario: Replacing magic link placeholder in template
    Given an HTML template with magic link placeholder
    And a magic link URL
    When the template is processed
    Then it should replace all placeholders with the actual link

  Scenario: Handling invalid email template JSON
    Given a SendGrid instance with invalid template
    And a user email and magic link
    When sendEmailWithMagicLink is called
    Then it should throw an error about invalid template JSON
