Feature: Transactional Email Service core
  Scenario: Service interface exports
    Given the transactional email service interface is available
    Then it should define sendTemplatedEmail(templateName, recipient, templateData)

  Scenario: Template utils exports
    Given the template utils module is available
    Then it should export loadTemplate and applyTemplateVariables
