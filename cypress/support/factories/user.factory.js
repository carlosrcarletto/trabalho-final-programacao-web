import { faker } from '@faker-js/faker'

export function createUser() {
  const firstName = faker.person.firstName()
  const lastName = faker.person.lastName()
  const birthDate = faker.date.birthdate({ mode: 'age', min: 18, max: 65 })

  return {
    title: faker.helpers.arrayElement(['Mr', 'Mrs']),
    name: `${firstName} ${lastName}`,
    email: faker.internet.email({ firstName, lastName, provider: `qa${Date.now()}.com` }).toLowerCase(),
    password: faker.internet.password({ length: 10 }),
    birth: {
      day: String(birthDate.getDate()),
      month: String(birthDate.getMonth() + 1),
      year: String(birthDate.getFullYear()),
    },
    address: {
      firstName,
      lastName,
      company: faker.company.name(),
      address1: faker.location.streetAddress(),
      address2: faker.location.secondaryAddress(),
      country: faker.helpers.arrayElement(['India', 'United States', 'Canada', 'Australia']),
      state: faker.location.state(),
      city: faker.location.city(),
      zipcode: faker.location.zipCode(),
      mobileNumber: faker.phone.number({ style: 'international' }),
    },
  }
}
