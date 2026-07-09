const EMAIL_REGEX =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const PHONE_REGEX =
  /^(\+254|0)[17]\d{8}$/;

export function validateCustomer(customer) {
  const errors = {};

  // First Name
  if (!customer.firstName?.trim()) {
    errors.firstName = "First name is required.";
  } else if (customer.firstName.trim().length < 2) {
    errors.firstName = "First name must be at least 2 characters.";
  }

  // Last Name
  if (!customer.lastName?.trim()) {
    errors.lastName = "Last name is required.";
  } else if (customer.lastName.trim().length < 2) {
    errors.lastName = "Last name must be at least 2 characters.";
  }

  // Email
  if (!customer.email?.trim()) {
    errors.email = "Email is required.";
  } else if (!EMAIL_REGEX.test(customer.email.trim())) {
    errors.email = "Enter a valid email address.";
  }

  // Phone
  if (!customer.phone?.trim()) {
    errors.phone = "Phone number is required.";
  } else if (!PHONE_REGEX.test(customer.phone.trim())) {
    errors.phone =
      "Enter a valid Kenyan phone number.";
  }

  // Address
  if (!customer.address?.street?.trim()) {
    errors.street = "Street is required.";
  }

  if (!customer.address?.city?.trim()) {
    errors.city = "City is required.";
  }

  if (!customer.address?.county?.trim()) {
    errors.county = "County is required.";
  }

  if (!customer.address?.country?.trim()) {
    errors.country = "Country is required.";
  }

  // Status
  if (
    !["Active", "Inactive"].includes(
      customer.status
    )
  ) {
    errors.status = "Invalid customer status.";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function emptyCustomer() {
  return {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    taxNumber: "",

    address: {
      street: "",
      city: "",
      county: "",
      postalCode: "",
      country: "Kenya",
    },

    status: "Active",

    notes: "",
  };
}