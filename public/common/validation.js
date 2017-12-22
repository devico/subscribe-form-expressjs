function validate (data) {
  return ({
    username: validateUsername(data.username),
    email: validateEmail(data.email)
  })
}

let validateEmail = (email) => {
  return (email.length > 0 && email.match(/\S+@\S+\.\S+/) != null) ? true : false
}

let validateUsername = (username) => {
  return (username.length > 0 && username.match(/^[A-Za-z]+$/) != null ) ? true : false
}

module.exports = validate
