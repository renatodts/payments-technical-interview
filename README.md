# Technical Interview Project

## Overview

For this technical interview, I opted to create a custom framework instead of using existing ones to showcase my capabilities and provide full control over architectural decisions, based on Hexagonal Architecture principles.

The project was completed over several days, with a strong focus on meeting the expectations and requirements of the task. I implemented CQRS (Command Query Responsibility Segregation) and Event Sourcing from scratch, while adhering to best practices.

I also incorporated Domain-Driven Design (DDD) concepts, including the creation of value objects and the implementation of business rules within their respective classes. The project reflects a thorough and thoughtful approach beyond standard professional requirements.

## Getting Started

### Installation

1. Install the necessary npm dependencies:

   ```bash
   npm install
   ```

2. Start the application:

   ```bash
   npm run start
   ```

3. In a separate terminal, start the external API:

   ```bash
   npm run external-api
   ```

### API Endpoints

- **Create Payment**

  Use the following `curl` command to create a payment. Import into Postman:

  ```bash
  curl -L 'localhost:3000/payment' -H 'Content-Type: application/json' -H 'Authorization: Bearer VALID_AUTH_TOKEN' -d '{ "pixKey": "1234567890", "amount": 1000.00 }'
  ```

- **Get Payment Details**

  Use the following `curl` command to retrieve payment details. Import into Postman:

  ```bash
  curl -L 'localhost:3000/payment/:id' -H 'Authorization: Bearer VALID_AUTH_TOKEN'
  ```

## Contact

Feel free to reach out if you have any questions or need further clarification.

Renato de Matos  
contact@renatodematos.com
