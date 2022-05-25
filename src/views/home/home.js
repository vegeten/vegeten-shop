import renderFooter from "../components/footer.js";
import renderNav from "../components/nav.js";

const mockUserAPI = {
  email: "test@test.com",
  fullName: "김정현",
  password: "12341234",
  phoneNumber: "010-5628-9304",
  address: {
    postalCode: "1234",
    address1: "마포구 합정동",
    address2: "123-123",
  },
  role: "basic-user",
};

renderNav(mockUserAPI.role === "basic-user" ? false : true);
renderFooter();