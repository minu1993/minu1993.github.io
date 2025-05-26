
document.addEventListener("DOMContentLoaded", function () {
  const clienteInput = document.getElementById("cliente");
  const vehiculoSelect = document.getElementById("vehiculo");
  const precioInput = document.getElementById("precio");
  const aplicarIVACheckbox = document.getElementById("aplicarIVA");
  const aplicarSeguroCheckbox = document.getElementById("aplicarSeguro");
  const calcularBtn = document.getElementById("calcularBtn");
  const resetBtn = document.getElementById("resetBtn");
  const resultadoDiv = document.getElementById("resultado");
  const errorContainer = document.getElementById("error-container");
  const successContainer = document.getElementById("success-container");
  const showGuideBtn = document.getElementById("showGuideBtn");
  const guideSection = document.getElementById("guideSection");
  const vehiculoForm = document.getElementById("vehiculoForm");

  // Event listeners
  calcularBtn.addEventListener("click", calcularPrecioFinal);
  resetBtn.addEventListener("click", reiniciarCalculadora);
  showGuideBtn.addEventListener("click", toggleGuide);

  // Limpiar errores visuales cuando el usuario empiece a escribir
  clienteInput.addEventListener("input", () => limpiarErrorCampo(clienteInput));
  vehiculoSelect.addEventListener("change", () => limpiarErrorCampo(vehiculoSelect));
  precioInput.addEventListener("input", () => limpiarErrorCampo(precioInput));

  function mostrarError(mensaje) {
    ocultarMensajes();
    errorContainer.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${mensaje}`;
    errorContainer.style.display = "flex";
    setTimeout(() => {
      errorContainer.style.opacity = "0";
      setTimeout(() => {
        errorContainer.style.display = "none";
        errorContainer.style.opacity = "1";
      }, 300);
    }, 5000);
  }

  function mostrarExito(mensaje) {
    ocultarMensajes();
    successContainer.innerHTML = `<i class="fas fa-check-circle"></i> ${mensaje}`;
    successContainer.style.display = "flex";
    setTimeout(() => {
      successContainer.style.opacity = "0";
      setTimeout(() => {
        successContainer.style.display = "none";
        successContainer.style.opacity = "1";
      }, 300);
    }, 3000);
  }

  function ocultarMensajes() {
    errorContainer.style.display = "none";
    successContainer.style.display = "none";
  }

  function marcarCampoError(campo) {
    campo.classList.add("error-field");
  }

  function limpiarErrorCampo(campo) {
    campo.classList.remove("error-field");
  }

  function limpiarTodosLosErrores() {
    clienteInput.classList.remove("error-field");
    vehiculoSelect.classList.remove("error-field");
    precioInput.classList.remove("error-field");
  }

  function validarFormulario() {
    let esValido = true;
    const errores = [];

    // Limpiar errores anteriores
    limpiarTodosLosErrores();

    // Validar nombre del cliente
    if (!clienteInput.value.trim()) {
      marcarCampoError(clienteInput);
      errores.push("Nombre del cliente");
      esValido = false;
    }

    // Validar selección de vehículo
    if (!vehiculoSelect.value) {
      marcarCampoError(vehiculoSelect);
      errores.push("Vehículo");
      esValido = false;
    }

    // Validar precio
    const precio = parseFloat(precioInput.value);
    if (!precioInput.value || isNaN(precio) || precio <= 0) {
      marcarCampoError(precioInput);
      errores.push("Precio válido");
      esValido = false;
    }

    if (!esValido) {
      let mensajeError = "Por favor complete correctamente: ";
      if (errores.length === 1) {
        mensajeError += errores[0];
      } else if (errores.length === 2) {
        mensajeError += errores.join(" y ");
      } else {
        mensajeError += errores.slice(0, -1).join(", ") + " y " + errores[errores.length - 1];
      }
      mostrarError(mensajeError);

      // Enfocar el primer campo con error
      if (!clienteInput.value.trim()) {
        clienteInput.focus();
      } else if (!vehiculoSelect.value) {
        vehiculoSelect.focus();
      } else if (!precioInput.value || parseFloat(precioInput.value) <= 0) {
        precioInput.focus();
      }
    }

    return esValido;
  }

  function calcularPrecioFinal() {
    if (!validarFormulario()) {
      return;
    }

    try {
      // Obtener valores del formulario
      const cliente = clienteInput.value.trim();
      const vehiculo = vehiculoSelect.value;
      const precioOriginal = parseFloat(precioInput.value);
      const aplicarIVA = aplicarIVACheckbox.checked;
      const aplicarSeguro = aplicarSeguroCheckbox.checked;

      // Calcular descuento (15% si el precio es mayor a $50,000)
      let descuento = 0;
      let precioBase = precioOriginal;
      let mensajeDescuento = "No aplica";

      if (precioOriginal > 50000) {
        descuento = precioOriginal * 0.15;
        precioBase = precioOriginal - descuento;
        mensajeDescuento = `-$${descuento.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`;
      }

      // Calcular IVA (15% del precio con descuento)
      let iva = 0;
      if (aplicarIVA) {
        iva = precioBase * 0.15;
      }

      // Calcular seguro ($1,200 si está marcado)
      const seguro = aplicarSeguro ? 1200 : 0;

      // Calcular precio final
      const precioFinal = precioBase + iva + seguro;

      // Mostrar resultados
      document.getElementById("resultadoCliente").textContent = cliente;
      document.getElementById("resultadoVehiculo").textContent = vehiculo;
      document.getElementById("resultadoPrecioOriginal").textContent = `$${precioOriginal.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
      document.getElementById("resultadoDescuento").textContent = mensajeDescuento;
      document.getElementById("resultadoPrecioBase").textContent = `$${precioBase.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
      document.getElementById("resultadoIVA").textContent = aplicarIVA
        ? `$${iva.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`
        : "No aplica";
      document.getElementById("resultadoSeguro").textContent = aplicarSeguro
        ? "$1,200.00"
        : "No aplica";
      document.getElementById("resultadoPrecioFinal").textContent = `Precio Final: $${precioFinal.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;

      // Mostrar la sección de resultados
      resultadoDiv.style.display = "block";

      // Mostrar mensaje de éxito
      mostrarExito("¡Cálculo realizado exitosamente!");

      // Scroll suave hacia los resultados
      resultadoDiv.scrollIntoView({ behavior: "smooth", block: "nearest" });
    } catch (error) {
      console.error("Error en el cálculo:", error);
      mostrarError("Ocurrió un error al realizar el cálculo. Por favor, verifique los datos ingresados.");
    }
  }

  function reiniciarCalculadora() {
    try {
      // Resetear formulario
      vehiculoForm.reset();

      // Ocultar resultados y mensajes
      resultadoDiv.style.display = "none";
      guideSection.style.display = "none";
      showGuideBtn.innerHTML = '<i class="fas fa-book-open"></i>';
      ocultarMensajes();

      // Limpiar errores visuales
      limpiarTodosLosErrores();

      // Enfocar el primer campo
      clienteInput.focus();

      // Mostrar mensaje de confirmación
      mostrarExito("Formulario reiniciado correctamente");
    } catch (error) {
      console.error("Error al reiniciar:", error);
      mostrarError("Ocurrió un error al reiniciar el formulario");
    }
  }

  function toggleGuide() {
    try {
      if (guideSection.style.display === "none" || !guideSection.style.display) {
        guideSection.style.display = "block";
        showGuideBtn.innerHTML = '<i class="fas fa-book"></i>';
        showGuideBtn.title = "Ocultar Guía";
        // Scroll suave hacia la guía
        guideSection.scrollIntoView({ behavior: "smooth", block: "nearest" });
      } else {
        guideSection.style.display = "none";
        showGuideBtn.innerHTML = '<i class="fas fa-book-open"></i>';
        showGuideBtn.title = "Mostrar Guía";
      }
    } catch (error) {
      console.error("Error al mostrar/ocultar guía:", error);
    }
  }

  // Prevenir el comportamiento por defecto del formulario
  vehiculoForm.addEventListener("submit", function (e) {
    e.preventDefault();
    calcularPrecioFinal();
  });

  // Permitir cálculo con Enter
  document.addEventListener("keypress", function (e) {
    if (e.key === "Enter" && !e.ctrlKey && !e.shiftKey) {
      e.preventDefault();
      calcularPrecioFinal();
    }
  });

  // Inicializar la aplicación
  clienteInput.focus();
});