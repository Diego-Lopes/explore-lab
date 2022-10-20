import "./css/index.css"
import IMask from "imask"

const ccBgColor01 = document.querySelector(".cc-bg svg > g g:nth-child(1) path")

const ccBgColor02 = document.querySelector(".cc-bg svg > g g:nth-child(2) path")

const colorLinear1 = document.querySelector(
  ".cc-bg svg > defs #paint4_linear_47_130 stop:nth-child(1)"
)
const colorLinear2 = document.querySelector(
  ".cc-bg svg > defs #paint4_linear_47_130 stop:nth-child(2)"
)

console.log(colorLinear1)

const ccLogoRight = document.querySelector(".cc-logo span:nth-child(2) img")
const ccLogoLeft = document.querySelector(".cc-logo span:nth-child(1) img")

function setCardType(type = "default", logo = "icon") {
  // const colors = {
  //   visa: ["#436d99", "#2d57f2"],
  //   mastercard: ["#df6f29", "#c69347"],
  //   default: ["black", "gray"],
  // }

  const colors = {
    visa: ["#ffc600", "#0846bb"],
    mastercard: ["#ec001b", "#f8a01b"],
    nubank: ["#820ad1", "#f5f5f5", "#646466"],
    elo: ["#00A4E0", "#EF4123"],
    alelo: ["#007858", "#C7D540"],
    american: ["#1f6cb4", "#fffef8"],
    maestro: ["#CC2131", "#3A9BD9"],
    bb: ["#003DA4", "#FFEF38"],
    hipercard: ["#9a1914", "#fcfdf7"],
    default: ["gray", "gray"],
  }

  if (type == "nubank") {
    ccBgColor01.setAttribute("fill", colors[type][2])
    ccBgColor02.setAttribute("fill", colors[type][2])
    ccLogoRight.setAttribute("src", `cc-${type}.svg`)
    ccLogoLeft.setAttribute("src", `cc-icon-${logo}.svg`)
    colorLinear2.setAttribute("stop-opacity", "0.81")
  }
  if (type == "default") {
    ccBgColor01.setAttribute("fill", colors[type][1])
    ccBgColor02.setAttribute("fill", colors[type][0])
    ccLogoRight.setAttribute("src", `cc-${type}.svg`)
    colorLinear1.setAttribute("stop-opacity", "0.0")
    colorLinear2.setAttribute("stop-opacity", "0.0")
  }
}
// setCardType()
// security code
const securityCode = document.querySelector("#security-code")
const securityCodePattern = {
  mask: "0000",
}
const securityCodeMasked = IMask(securityCode, securityCodePattern)

//validando campo de data cartão
const expirationDate = document.querySelector("#expiration-date")
const expirationDatePattern = {
  mask: "MM{/}YY",
  blocks: {
    YY: {
      mask: IMask.MaskedRange,
      from: String(new Date().getFullYear()).slice(2),
      to: String(new Date().getFullYear() + 10).slice(2),
    },
    MM: {
      mask: IMask.MaskedRange,
      from: 1,
      to: 12,
    },
  },
}
const expirationDateMasked = IMask(expirationDate, expirationDatePattern)

const cardNumber = document.querySelector("#card-number")

const cardNumberPattern = {
  mask: [
    { mask: "0000 0000 0000 0000", regex: /^4\d{0,15}/, cardType: "visa" },
    {
      mask: "0000 0000 0000 0000",
      regex: /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
      cardType: "nubank",
    },
    { mask: "0000 0000 0000 0000", cardType: "default" },
  ],
  dispatch: function (appended, dynamicMasked) {
    const number = (dynamicMasked.value + appended).replace(/\D/g, "")
    //validando mask
    const foundMask = dynamicMasked.compiledMasks.find(function (item) {
      return number.match(item.regex)
    })

    console.log(foundMask)
    return foundMask
  },
}

const cardNumberMasked = IMask(cardNumber, cardNumberPattern)

//guardar a informação do botão.
const addButton = document.querySelector("#add-card")

addButton.addEventListener("click", () => {
  alert("Cartão adicionado")
})

//desativando reload do submit do form
document
  .querySelector("form")
  .addEventListener("submit", (event) => event.preventDefault())

//Selecionando input de nome e passando para div do cartão.
const cardHolder = document.querySelector("#card-holder")
cardHolder.addEventListener("input", () => {
  const ccHolder = document.querySelector(".cc-holder .value")

  ccHolder.innerText =
    cardHolder.value.length === 0 ? "FULANDO DA SILVA" : cardHolder.value
})

//função para obter e exibir o cvc do cartão
securityCodeMasked.on("accept", () => {
  updateSecurityCode(securityCodeMasked.value)
})
function updateSecurityCode(code) {
  const ccSecutiry = document.querySelector(".cc-security .value")
  ccSecutiry.innerText = code.length === 0 ? "000" : code
}
//Exibir os números do cartão.
cardNumberMasked.on("accept", () => {
  const cardType = cardNumberMasked.masked.currentMask.cardtype
  //mudar o tipo do cartão
  setCardType()
  updateCardNumber(cardNumberMasked.value)
})
function updateCardNumber(number) {
  const ccNumber = document.querySelector(".cc-number")
  ccNumber.innerText = number.length === 0 ? "0000 0000 0000 0000" : number
}
//data de expiração.
expirationDateMasked.on("accept", () => {
  updateExpirationDate(expirationDateMasked.value)
})
function updateExpirationDate(date) {
  const ccExpiration = document.querySelector(".cc-extra .value")
  ccExpiration.innerText = date.length === 0 ? "02/32" : date
}
