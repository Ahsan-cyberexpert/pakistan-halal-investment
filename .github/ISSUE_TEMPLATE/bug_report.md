---
name: Bug Report
description: Report a bug in the platform
title: "[BUG] "
labels: ["bug"]
assignees: []

body:
  - type: markdown
    attributes:
      value: "## Bug Report"
  
  - type: textarea
    attributes:
      label: Description
      description: Describe the bug clearly
      placeholder: "What went wrong?"
    validations:
      required: true
  
  - type: textarea
    attributes:
      label: Steps to Reproduce
      description: How can we reproduce this bug?
      placeholder: |
        1. Go to...
        2. Click...
        3. See error...
    validations:
      required: true
  
  - type: textarea
    attributes:
      label: Expected Behavior
      description: What should have happened?
    validations:
      required: true
  
  - type: input
    attributes:
      label: Browser
      placeholder: "Chrome, Firefox, Safari, etc."
    validations:
      required: true
