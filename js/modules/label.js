const setup = id => {
    document.querySelectorAll('#work h3').forEach(h=>{
        h.classList.add("split-flap");
        const link = h.querySelector('a');
        const text = link.textContent.trim();
        const textLength = text.length;
        let textWrap = "";
        for (let i = 0; i < textLength; i++) {
            let newText = (text[i] === " ") ? "\xa0" : text[i];
            textWrap += `<span>${newText}</span>`;
        }
        link.innerHTML = textWrap;
    })
}

const Label = {
    setup
}
export default Label;