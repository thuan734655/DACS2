const checkValidData = (e) => {
  if (e.target.value === "") {
    // neu da ton tai class thi xoa di de add lai
    e.target.classList.remove("err-form");
    e.target.classList.remove("err-form-animation");

    // add lai class
    e.target.classList.add("err-form");
    e.target.classList.add("err-form-animation");
    e.target.classList.remove("valid-form");
  } else {
    e.target.classList.remove("err-form-animation");
    e.target.classList.remove("valid-form");
    e.target.classList.add("valid-form");
  }
};

export default checkValidData;
