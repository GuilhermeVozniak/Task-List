"use strict"

//ao carregar a página adiciona a tabela puxa tarefas do local storage
addEventListener("load", () => {
    //pega tarefas do local sotage
    tarefas = JSON.parse(localStorage.getItem('tarefasArray'))

    //renderiza as tarefas
    renderizarTarefas()
})

//deleteAll
let deleteAll = $("#deleteAll")
deleteAll.click(() => {
    //limpa tarefas
    tarefas = []

    //Copia o array tarefas para o local storage para salvar a lista vazia
    localStorage.setItem("tarefasArray", JSON.stringify(tarefas))

    //renderiza as tarefas novamente
    let table = $(".table").html(`
    <tr class="tableLine">
        <td class="tableData">Name↓</td>
        <td class="tableData">Description↓</td>
        <td class="tableData">Done↓</td>
        <td class="tableData">Delete↓</td>
    </tr>
    `)
})

//add tarefa
let taskName = $("#taskName")
let taskDescription = $("#taskDescription")
let add = $("#add")
let tarefas = []

add.click(() => {//Escuta click no btn add
    let novaTarefa = {
        name: `${taskName.val()}`,
        descrition: `${taskDescription.val()}`,
        done: "✓",
        feito: false,//estado do done
        delete: "X"
    }

    addNovaTarefa(novaTarefa)

    //Copia o array tarefas para o local storage para salvar a nova tarefa
    localStorage.setItem("tarefasArray", JSON.stringify(tarefas))

    //renderiza as tarefas
    renderizarTarefas()

    taskName.val("")//limpa o campo
    taskDescription.val("")//limpa o campo
})


function addNovaTarefa(tarefa) {
    tarefas.push(tarefa)
}


//tabela de tarefas
let tabela = $(".table")

function renderizarTarefas() {
    if (tarefas.length > 0) {//cabecalho da lista
        tabela.html(`
        <tr class="tableLine">
            <td class="tableData">Name↓</td>
            <td class="tableData">Description↓</td>
            <td class="tableData">Done↓</td>
            <td class="tableData">Delete↓</td>
        </tr>
        `)
    }

    tarefas.forEach(i => {//adiciona todos os itens na lista
        tabela.append(criaLinhaTabela(i))
    })
}

function criaLinhaTabela(objLinha) {
    let tr = document.createElement("tr")
    tr.className = "tableLine"

    //class do estado da tarefa
    let classe = 0
    if (objLinha.feito == false) {
        classe = "tableData"
    }
    else {
        classe = "tableData feito"
    }

    tr.innerHTML = `
    
    <td class="tableData">${objLinha.name}</td>
    <td class="tableData description" onclick="mudarDescricao(this, this.parentNode)">${objLinha.descrition}</td>
    <td class="${classe}" onclick="markDone(this, this.parentNode)">${objLinha.done}</td>
    <td class="tableData excluir" onclick="deleteTask(this.parentNode)">${objLinha.delete}</td>

    `
    return tr
}

function deleteTask(linha) {
    //procura no array e deleta
    linha.className += " deletar"//adicona class deletar
    let name = document.getElementsByClassName("deletar")[0].getElementsByClassName("tableData")[0].innerHTML

    tarefas.forEach(e => {//deleta do array
        if (name == e.name) {
            let index = tarefas.indexOf(e)
            tarefas.splice(index, 1)
        }
    })

    linha.remove()//remove da tela

    //Copia o array tarefas para o local storage para atualizar o item apagado
    localStorage.setItem("tarefasArray", JSON.stringify(tarefas))//salva sem a nova tarefa

}

function markDone(elemento, pai) {
    //faz salvar o estado da tarefa
    pai.className += " fazido"
    let name = document.getElementsByClassName("fazido")[0].getElementsByClassName("tableData")[0].innerHTML

    let index = 0
    tarefas.forEach(e => {//encontra o index do item clicado no array
        if (name == e.name) {
            index = tarefas.indexOf(e)
        }
    })

    //muda o símbolo mostrado par ao usuário
    if (elemento.className === "tableData") {
        elemento.className += " feito"//muda o estilo   
        tarefas[index].feito = true//faz a tarefa ficar no estado de feita
    }
    else {
        elemento.className = elemento.className.replace(" feito", "")//muda o estilo
        tarefas[index].feito = false//faz a tarefa ficar no estado de incompleta/Não feita
    }

    //Copia o array tarefas para o local storage para atualizar o simbolo de feito
    localStorage.setItem("tarefasArray", JSON.stringify(tarefas))//salva sem a nova tarefa
}

//mudar a descricao de uma tarefa e salva
function mudarDescricao(tag, pai) {
    pai = pai.querySelectorAll(".tableData")

    //cria a caixa de texto
    let referencia = document.body
    //text area
    let textArea = document.createElement(`textarea`)
    textArea.className = "textArea"
    textArea.rows = "5"
    textArea.cols = "33"
    textArea.value = `${tag.innerHTML}`


    //escuta a escrita No text Area, muda na tela e salva a mudança
    textArea.addEventListener("input", () => {
        tag.innerHTML = textArea.value//coloca na tela

        //salva a nova descricao
        tarefas.forEach((e) => {
            if (pai[0].innerHTML == e.name) {
                e.descrition = textArea.value//coloca a nova descricao na lista

                //Copia o array tarefas para o local storage para atualizar a descricao
                localStorage.setItem("tarefasArray", JSON.stringify(tarefas))//salva a nova descricao
            }
        })
    })

    //div que envolve o text area
    let div = document.createElement("div")
    div.className = "containerTextarea"
    div.innerHTML = `<span id="close">X</span>`

    //adiciona na tela de fato
    div.appendChild(textArea)
    referencia.appendChild(div)


    //event listener de fechar a descricao
    let close = $("#close")
    close.click((e) => {
        close.parent().remove()
    })

}

