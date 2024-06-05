export const allowedTo = (...rols) => {

  return (req , res , next) => {
    if(!rols.includes(req.user.role)){
      return "this role is not authrized"
    }
    next();
  }
}