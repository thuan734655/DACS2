const checkValidData = (e) => {
    const span = e.target.parentNode.querySelector("span");
    
    if (e.target.value === "") {
      // Nếu đã tồn tại class, xóa đi để thêm lại
      e.target.classList.remove("err-form", "err-form-animation", "valid-form");
      span?.classList.remove("err-span");
  
      // Thêm class lỗi
      e.target.classList.add("err-form", "err-form-animation");
      span?.classList.add("err-span");
    } else {
      // Xóa class lỗi và thêm class hợp lệ
      e.target.classList.remove("err-form", "err-form-animation");
      e.target.classList.add("valid-form");
  
      // Xóa lỗi hiển thị của span nếu có
      span?.classList.remove("err-span");
    }
  };
  
  export default checkValidData;
  