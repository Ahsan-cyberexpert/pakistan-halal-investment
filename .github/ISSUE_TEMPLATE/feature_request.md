---
name: Feature Request
description: Suggest a new feature
title: "[FEATURE] "
labels: ["enhancement"]

body:
  - type: markdown
    attributes:
      value: "## Feature Request"
  
  - type: textarea
    attributes:
      label: Description
      description: Describe the feature you want
      placeholder: "What feature would you like?"
    validations:
      required: true
  
  - type: textarea
    attributes:
      label: Use Case
      description: Why do you need this feature?
    validations:
      required: true
  
  - type: textarea
    attributes:
      label: Additional Context
      description: Any other details?
