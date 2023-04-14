// console.log(localStorage.getItem("token"));
export const config = {
  headers: {
    Authorization: `${localStorage.getItem("token")}`,
  },
};
