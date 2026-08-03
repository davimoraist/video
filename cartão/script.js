  const track = document.getElementById('slideshowTrack');

    // Duplica os cards dinamicamente para garantir que a rolagem infinita não mostre espaços vazios
    track.innerHTML += track.innerHTML;

    let speed = 1; // Velocidade da rotação (aumente ou diminua conforme preferir)
    let currentPos = 0;

    function animate() {
        currentPos -= speed;

            // Quando passar metade da largura (que é a lista original de itens), reseta suavemente a posição
            if (Math.abs(currentPos) >= track.scrollWidth / 2) {
        currentPos = 0;
            }

    track.style.transform = `translateX(${currentPos}px)`;
    requestAnimationFrame(animate);
        }

    // Inicia a animação
    animate();

    // Pausa a rotação ao passar o mouse por cima do serviço (opcional)
    const wrapper = document.querySelector('.slideshow-wrapper');
    let normalSpeed = speed;
        wrapper.addEventListener('mouseenter', () => speed = 0);
        wrapper.addEventListener('mouseleave', () => speed = normalSpeed);


function WhatsApp(event){

    if (event) event.preventDefault();
    var telefone = "556195756256"
    var mensagem = "Olá! Gostaria de agendar um horário na Black Crown Barber."
    const link = `https://wa.me/${telefone}?text=${encodeURIComponent(mensagem)}`;

    // Abre o WhatsApp em uma nova aba
    window.open(link, '_blank');
    
}

function Pomada(event) {

    if (event) event.preventDefault();
    var telefone = "556195756256"
    var mensagem = "Olá! Tenho interesse em comprar a Pomada Modeladora que vi no site da Black Crown Barber. Gostaria de finalizar a compra."
    const link = `https://wa.me/${telefone}?text=${encodeURIComponent(mensagem)}`;

    // Abre o WhatsApp em uma nova aba
    window.open(link, '_blank');

}

function oleo(event) {

    if (event) event.preventDefault();
    var telefone = "556195756256"
    var mensagem = "Olá! Tenho interesse em comprar o Óleo para Barba que vi no site da Black Crown Barber. Gostaria de finalizar a compra."
    const link = `https://wa.me/${telefone}?text=${encodeURIComponent(mensagem)}`;

    // Abre o WhatsApp em uma nova aba
    window.open(link, '_blank');

}

function balm(event) {

    if (event) event.preventDefault();
    var telefone = "556195756256"
    var mensagem = "Olá! Tenho interesse em comprar o Balm para Barba que vi no site da Black Crown Barber. Gostaria de finalizar a compra."
    const link = `https://wa.me/${telefone}?text=${encodeURIComponent(mensagem)}`;

    // Abre o WhatsApp em uma nova aba
    window.open(link, '_blank');

}

function Shampoo(event) {

    if (event) event.preventDefault();
    var telefone = "556195756256"
    var mensagem = "Olá! Tenho interesse em comprar o Shampoo Masculino que vi no site da Black Crown Barber. Gostaria de finalizar a compra."
    const link = `https://wa.me/${telefone}?text=${encodeURIComponent(mensagem)}`;

    // Abre o WhatsApp em uma nova aba
    window.open(link, '_blank');

}