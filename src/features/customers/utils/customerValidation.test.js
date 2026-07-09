import {
  emptyCustomer,
  validateCustomer,
} from "./customerValidation";

describe("Customer Validation", () => {
  test("returns valid for a correct customer", () => {
    const customer = emptyCustomer();

    customer.firstName = "John";
    customer.lastName = "Kamau";
    customer.email = "john@test.com";
    customer.phone = "+254712345678";

    customer.address.street = "Moi Avenue";
    customer.address.city = "Nairobi";
    customer.address.county = "Nairobi";

    const result = validateCustomer(customer);

    expect(result.valid).toBe(true);
    expect(result.errors).toEqual({});
  });

  test("fails when required fields are missing", () => {
    const result = validateCustomer(
      emptyCustomer()
    );

    expect(result.valid).toBe(false);

    expect(result.errors.firstName).toBeDefined();
    expect(result.errors.lastName).toBeDefined();
    expect(result.errors.email).toBeDefined();
    expect(result.errors.phone).toBeDefined();
    expect(result.errors.street).toBeDefined();
    expect(result.errors.city).toBeDefined();
  });

  test("rejects invalid email", () => {
    const customer = emptyCustomer();

    customer.firstName = "John";
    customer.lastName = "Kamau";
    customer.email = "abc";

    customer.phone = "+254712345678";

    customer.address.street = "Street";
    customer.address.city = "Nairobi";
    customer.address.county = "Nairobi";

    const result = validateCustomer(customer);

    expect(result.errors.email).toBeDefined();
  });

  test("rejects invalid phone", () => {
    const customer = emptyCustomer();

    customer.firstName = "John";
    customer.lastName = "Kamau";
    customer.email = "john@test.com";
    customer.phone = "123456";

    customer.address.street = "Street";
    customer.address.city = "Nairobi";
    customer.address.county = "Nairobi";

    const result = validateCustomer(customer);

    expect(result.errors.phone).toBeDefined();
  });
});