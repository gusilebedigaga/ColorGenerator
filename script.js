class ColorSwitcher{
    selectors = {
        switchColorButton: '[data-js-color-switcher]',
        colorBox: '[data-js-color-box]',
        hexHeader: '[data-js-hex-header]',
        copyText: '[data-js-copy-text]',
        lastColorsList: '[data-js-last-colors-list]'
    }

    constructor() {
        this.RGB = this.getRandomRgbValues()
        this.switchColorButtonElement = document.querySelector(this.selectors.switchColorButton)
        this.colorBoxElement = document.querySelector(this.selectors.colorBox)
        this.hexHeaderElement = document.querySelector(this.selectors.hexHeader)
        this.copyTextElement = document.querySelector(this.selectors.copyText)
        this.lastColorsListElement = document.querySelector(this.selectors.lastColorsList)
        const hexFromUrl = window.location.hash.replace('#', '')
        if (this.isValidHex(hexFromUrl)) {
            this.RGB = this.hexToRgb(hexFromUrl)
            this.updateColorAndHex()
        } else {
            this.updateColorAndHex()
        }
        this.addColorToAside()
        this.bindEvents() 
    }
    
    getRandomRgbNumber() {
        return Math.floor(Math.random() * 256)
    }

    getRandomRgbValues() {
        return {
            r: this.getRandomRgbNumber(),
            g: this.getRandomRgbNumber(),
            b: this.getRandomRgbNumber(),
        }
    }

    getRgb() {
        return `rgb(${this.RGB.r}, ${this.RGB.g}, ${this.RGB.b})`
    }
    
    updateUrl() {
        const hexCode = this.rgbToHex(this.getRgb());
        window.history.replaceState({}, '', `${window.location.pathname}#${hexCode}`)
    }

    replaceState() {
        const url = JSON.stringify(window.location)
        const urlObj = JSON.parse(url)
        const href = urlObj.href
        const hrefHex = href.toString().slice(-7)
        this.RGB = this.hexToRgb(hrefHex)
        console.log(this.RGB)
    }

    updateColorAndHex() {
        this.colorBoxElement.style.backgroundColor =  this.getRgb()
        this.hexHeaderElement.textContent = this.rgbToHex(this.getRgb())
        this.updateUrl()
    }

    addColorToAside() {
        const li = document.createElement('li');
        li.classList.add('last-colors-item');
        li.style.backgroundColor = this.getRgb();
        this.lastColorsListElement.prepend(li);
        if(this.lastColorsListElement.childElementCount > 100){
            this.lastColorsListElement.lastElementChild.remove()
        }
    }

    rgbToHex(rgbString) {
        if (rgbString.startsWith('#')){
            return rgbString
        }
        const rgbValues = rgbString.match(/\d+/g).map(Number)
        if (rgbValues.length !== 3) {
            return 'invalid rgb'
        }
        const r = rgbValues[0];
        const g = rgbValues[1];
        const b = rgbValues[2];

        return `#${[r,g,b].map(x => x.toString(16).padStart(2, '0')).join('')}`;
    }

    hexToRgb(hex) {
        const hexColor = hex.replace("#", "")
        const r = parseInt(hexColor.substring(0, 2), 16)
        const g = parseInt(hexColor.substring(2, 4), 16)
        const b = parseInt(hexColor.substring(4, 6), 16)
        return { r, g, b }
    }

    isValidHex(hex) {
        const regex = /^#[0-9A-F]{6}$/i;
        return regex.test(`${hex}`)
    }

    switchColorButtonElementOnClick = () => {
        this.RGB = this.getRandomRgbValues();
        this.updateColorAndHex();
        this.addColorToAside();
        this.copyTextElement.classList.add('copy-text-non-visible');
    }

    hexHeaderElementOnClick = () => {
        const hexCode = this.hexHeaderElement.textContent
        navigator.clipboard.writeText(hexCode).then(() => {
            this.copyTextElement.classList.remove('copy-text-non-visible')
        })
    }

    lastColorItemElementOnClick = (event) => {
        const lastColorItemElement = event.target.closest('.last-colors-item');
        if (lastColorItemElement) {
            const backgroundColor = lastColorItemElement.style.backgroundColor;
            const hexColor = this.rgbToHex(backgroundColor)
            this.hexHeaderElement.textContent = hexColor
            this.colorBoxElement.style.backgroundColor = hexColor;
            this.RGB = this.hexToRgb(hexColor)
            this.updateColorAndHex();
        }
    }

    bindEvents() {
        this.switchColorButtonElement.addEventListener('click', this.switchColorButtonElementOnClick)
        this.hexHeaderElement.addEventListener('click', this.hexHeaderElementOnClick)
        document.addEventListener('click', (event) => this.lastColorItemElementOnClick(event))
    }
}

new ColorSwitcher()
