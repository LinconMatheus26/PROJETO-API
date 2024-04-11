// Inicialização do aplicativo
document.addEventListener('DOMContentLoaded', function() {
  // Exibe a primeira aba por padrão
  document.getElementById('schedule').style.display = 'block';
});

// Função para alternar entre abas
function openTab(event, tabName) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName('tabcontent');
  for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = 'none';
  }
  tablinks = document.getElementsByClassName('tablinks');
  for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(' active', '');
  }
  document.getElementById(tabName).style.display = 'block';
  event.currentTarget.className += ' active';
}

// Função para buscar o endereço com base no CEP
async function fetchAddressByCEP(cep) {
  try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();
      if (data.erro) {
          console.error('CEP inválido');
          return;
      }
      document.getElementById('street').value = data.logradouro;
      document.getElementById('city').value = data.localidade;
      document.getElementById('state').value = data.uf;
  } catch (error) {
      console.error('Erro ao buscar o endereço:', error);
  }
}

// Adiciona evento de alteração no campo de CEP
document.getElementById('cep').addEventListener('change', function(event) {
  const cep = event.target.value.replace(/\D/g, ''); // Remove caracteres não numéricos
  if (cep.length === 8) {
      fetchAddressByCEP(cep);
  }
});

// Função para acessar a câmera do usuário
function getUserMedia(constraints) {
  // Verifica se a API Promise-based está disponível
  if (navigator.mediaDevices) {
    return navigator.mediaDevices.getUserMedia(constraints);
  }
    
  // Caso contrário, tenta utilizar a API antiga
  var legacyApi = navigator.getUserMedia || navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia || navigator.msGetUserMedia;
    
  if (legacyApi) {
    // Transforma a API antiga em Promise
    return new Promise(function (resolve, reject) {
      legacyApi.bind(navigator)(constraints, resolve, reject);
    });
  }
}

// Função para obter o stream de mídia (vídeo)
function getStream(type) {
  if (!navigator.mediaDevices && !navigator.getUserMedia && !navigator.webkitGetUserMedia &&
    !navigator.mozGetUserMedia && !navigator.msGetUserMedia) {
    alert('User Media API not supported.');
    return;
  }

  var constraints = {};
  constraints[type] = true;
  
  getUserMedia(constraints)
    .then(function (stream) {
      var mediaControl = document.querySelector(type);
      
      if ('srcObject' in mediaControl) {
        mediaControl.srcObject = stream;
      } else if (navigator.mozGetUserMedia) {
        mediaControl.mozSrcObject = stream;
      } else {
        mediaControl.src = (window.URL || window.webkitURL).createObjectURL(stream);
      }
      
      mediaControl.play();
    })
    .catch(function (err) {
      alert('Error: ' + err);
    });
}

// Função para capturar a imagem da câmera
function captureImage() {
  const canvas = document.createElement('canvas');
  const video = document.getElementById('video');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
  const imageDataURL = canvas.toDataURL('image/png');
  // Você pode enviar esse imageDataURL para sua API ou processá-lo ainda mais
  console.log('Captured image:', imageDataURL);
}

// Inicializa a câmera quando a página carrega
window.addEventListener('DOMContentLoaded', () => {
  getStream('video'); // Inicializa o stream de vídeo
});

// Event listener para o botão de captura
document.getElementById('captureButton').addEventListener('click', captureImage);

// Event listener para o envio do formulário
document.getElementById('appointment-form').addEventListener('submit', function(event) {
  event.preventDefault();
  
  const name = document.getElementById('name').value;
  const date = document.getElementById('date').value;
  const time = document.getElementById('time').value;
  const cep = document.getElementById('cep').value;
  const street = document.getElementById('street').value;
  const number = document.getElementById('number').value;
  const complement = document.getElementById('complement').value;
  const city = document.getElementById('city').value;
  const state = document.getElementById('state').value;

  const appointment = {
    name: name,
    date: date,
    time: time,
    address: {
      cep: cep,
      street: street,
      number: number,
      complement: complement,
      city: city,
      state: state
    }
  };

  saveAppointment(appointment);
});

// Salva a consulta no localStorage e remove do formulário
function saveAppointment(appointment) {
  let appointments = JSON.parse(localStorage.getItem('appointments')) || [];
  appointments.push(appointment);
  localStorage.setItem('appointments', JSON.stringify(appointments));
  
  displayAppointments();
  
  // Remover o formulário de confirmação após o agendamento
  document.getElementById('name').value = '';
  document.getElementById('date').value = '';
  document.getElementById('time').value = '';
  document.getElementById('cep').value = '';
  document.getElementById('street').value = '';
  document.getElementById('number').value = '';
  document.getElementById('complement').value = '';
  document.getElementById('city').value = '';
  document.getElementById('state').value = '';
}

// Exibe as consultas agendadas ao carregar a página
window.onload = displayAppointments;

// Exibe todas as consultas agendadas
function displayAppointments() {
  const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
  const appointmentsList = document.getElementById('appointments-list');
  appointmentsList.innerHTML = '';

  appointments.forEach(function(appointment, index) {
    const li = document.createElement('li');
    li.classList.add('appointment-item');
    li.innerHTML = `<strong>${appointment.name}</strong> - ${appointment.date} ${appointment.time} <button onclick="deleteAppointment(${index})">Excluir</button>`;
    appointmentsList.appendChild(li);
  });
}

// Deleta uma consulta
function deleteAppointment(index) {
  let appointments = JSON.parse(localStorage.getItem('appointments')) || [];
  appointments.splice(index, 1);
  localStorage.setItem('appointments', JSON.stringify(appointments));
  
  displayAppointments();
}

// Função para buscar o endereço com base no CEP
async function fetchAddressByCEP(cep) {
  try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();
      if (data.erro) {
          console.error('CEP inválido');
          return;
      }
      document.getElementById('street').value = data.logradouro;
      document.getElementById('city').value = data.localidade;
      document.getElementById('state').value = data.uf;
  } catch (error) {
      console.error('Erro ao buscar o endereço:', error);
  }
}

// Adiciona evento de alteração no campo de CEP
document.getElementById('cep').addEventListener('change', function(event) {
  const cep = event.target.value.replace(/\D/g, ''); // Remove caracteres não numéricos
  if (cep.length === 8) {
      fetchAddressByCEP(cep);
  }
});
