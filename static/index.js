const registerUserForm = document.querySelector('#register_form')
const registerUserEmail = document.querySelector('#registerUser')
const registerUserPassword = document.querySelector('#registerUser')
const loginUserForm = document.querySelector('#login_form')
const loginUserEmail = document.querySelector('#loginEmail')
const loginUserPassword = document.querySelector('#loginPasword')

const registerUser = async () => {
  const data = new FormData(registerUserForm)

  const headers = new Headers({
    'Content-Type': 'application/json; charset=utf-8'
  })

  const body = JSON.stringify({
    email: data.get('email'),
    passoword: data.get('password')
  })

  return await fetch('/api/users', { method: 'POST', headers, body })
}

registerUserForm.addEventListener('submit', (event) => {
  event.preventDefault()

  addTaskMsg.classList.remove('is-danger', 'is-success')
  addTaskMsg.classList.add('is-hidden')

  setTimeout(() => {
    registerUser()
      .then((response) => {
        if (!response.ok) {
          throw Error(response.statusText)
        }

        addTaskMsg.textContent = 'Pomyślnie zarejstrowano.'
        addTaskMsg.classList.add('is-success')
        registerUserEmail.value = ''
        registerUserPassword.value = ''

      })
      .catch(() => {
        addTaskMsg.textContent = 'Wystąpił błąd podczas rejestracji. Spróbuj ponownie później.'
        addTaskMsg.classList.add('is-danger')
      })
      .finally(() => {
        addTaskMsg.classList.remove('is-hidden')
      })
  }, 1000)
})