// Botão de adicionar usuário
const btnSalvar = document.getElementById("btnadd")

// ID Auto Increment
let contador = localStorage.getItem("contador") ? parseInt(localStorage.getItem("contador")) : 0

// Array usuários
let arrUsuarios = localStorage.getItem("arrusuarios") ? JSON.parse(localStorage.getItem("arrusuarios")) : []

// Adicionar usuário
btnSalvar.addEventListener("click", () => {
  AddUser()
})

function AddUser() {
  // Inputs
  const nome = document.getElementById("inptname").value.trim()
  const email = document.getElementById("inptemail").value.trim()
  const number = document.getElementById("inptnumber").value.trim()

  // Validação dos campos
  if (!nome || !email || !number) {
    alert("Confira os dados e tente novamente")
    return;
  }

  // Criando ou editando um usuário
  let userId = btnSalvar.getAttribute("data-editing-id")

  if (userId) {
    // Atualizar usuário existente
    let index = arrUsuarios.findIndex((user) => user[0] == userId)
    if (index !== -1) {
      arrUsuarios[index] = [userId, nome, email, number]
    }
    btnSalvar.removeAttribute("data-editing-id")
    btnSalvar.innerHTML = "<b>Save User</b>"
  } else {
    // Novo usuário
    contador++;
    localStorage.setItem("contador", contador);
    arrUsuarios.push([contador, nome, email, number])
  }

  // Salvar no LocalStorage
  localStorage.setItem("arrusuarios", JSON.stringify(arrUsuarios))

  // Atualizar a exibição
  showUsers()

  // Limpar inputs
  document.getElementById("inptname").value = ""
  document.getElementById("inptemail").value = ""
  document.getElementById("inptnumber").value = ""

  const addmodal = document.getElementById("add-modal")
  const addmodalContent = addmodal.querySelector("div")

  addmodal.classList.remove("hidden")
  setTimeout(() => {
    addmodalContent.classList.add("scale-100", "opacity-100")
  }, 10)

  setTimeout(() => {
    addmodalContent.classList.remove("scale-100", "opacity-100")
    setTimeout(() => {
        addmodal.classList.add("hidden")
    }, 300)
  }, 2000)
}

// Deletar usuário
function deleteUser(id) {
  arrUsuarios = arrUsuarios.filter((user) => user[0] != id)
  localStorage.setItem("arrusuarios", JSON.stringify(arrUsuarios))
  showUsers()

  // Modal delete 
  const deletemodal = document.getElementById("delete-modal")
  const deletemodalContent = deletemodal.querySelector("div")

  deletemodal.classList.remove("hidden")
  setTimeout(() => {
    deletemodalContent.classList.add("scale-100", "opacity-100")
  }, 10)

  setTimeout(() => {
    deletemodalContent.classList.remove("scale-100", "opacity-100")
    setTimeout(() => {
        deletemodal.classList.add("hidden")
    }, 300)
  }, 2000)
}

// Editar usuário
function editUser(id) {
  let user = arrUsuarios.find((user) => user[0] == id)
  if (!user) return;

  // Preencher os inputs
  document.getElementById("inptname").value = user[1]
  document.getElementById("inptemail").value = user[2]
  document.getElementById("inptnumber").value = user[3]

  // "Atualizar"
  btnSalvar.innerHTML = "<b>Update</b>"
  btnSalvar.setAttribute("data-editing-id", id)
}

// Exibir Usuarios
function showUsers() {
  const tabela = document.getElementById("datagrid")
  tabela.innerHTML = ""

  arrUsuarios.forEach((user) => {
    let id = user[0]
    let nome = user[1]
    let email = user[2]
    let number = user[3]

    tabela.innerHTML += `
      <div class="flex flex-col-reverse sm:flex-row" id="user-${id}">
        <div class="flex flex-row gap-2 p-5 justify-center items-center">
          <button class="w-10 h-8 bg-red-500 rounded-lg text-white btndelete" data-id="${id}">
            <i class="fa-solid fa-trash"></i>
          </button>

          <button class="w-10 h-8 bg-blue-500 rounded-lg text-white btnedit" data-id="${id}">
            <i class="fa-solid fa-pen-to-square"></i>
          </button>
        </div>
        
        <div class="flex flex-col gap-5 p-5 sm:flex-row">
          <b class="text-green-500">ID: ${id} => </b>
          <b>Name: <span class="username">${nome}</span> </b>
          <b>Email: <span class="useremail">${email}</span> </b>
          <b>Number: <span class="usernumber">${number}</span> </b>
        </div>
      </div>

      <div class="flex justify-center items-center">
        <div class="w-full border-t border-gray-500 m-5"></div>
      </div>
    `
  })

  // Adicionar eventos para botões
  // Deletar Usuário
  document.querySelectorAll(".btndelete").forEach((button) => {
    button.addEventListener("click", (event) => {
      let userId = event.target.closest("button").getAttribute("data-id")
      deleteUser(userId)
    })
  })

  //Editar Usuário
  document.querySelectorAll(".btnedit").forEach((button) => {
    button.addEventListener("click", (event) => {
      let userId = event.target.closest("button").getAttribute("data-id")
      editUser(userId)
    })
  })
}

// Carregar os usuários ao iniciar
document.addEventListener("DOMContentLoaded", () => {
  showUsers()
  const inputnumber = document.getElementById("inptnumber")
  var masknumber = { mask: "(00) 00000-0000" }
  IMask(inputnumber, masknumber)
})
