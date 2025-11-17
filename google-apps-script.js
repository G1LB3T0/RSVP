// Código para Google Apps Script
// Este código debe ser copiado en https://script.google.com

const SPREADSHEET_ID = '1exDWOnV4w0OBe2NkAYZ2oTk32uXzNvdDSykir2WuKpY';

function doGet(e) {
  try {
    const action = e.parameter.action;

    if (action === 'verificar') {
      return verificarConfirmacion(e);
    } else if (action === 'confirmar') {
      return guardarConfirmacion(e);
    } else {
      return ContentService
        .createTextOutput(JSON.stringify({ 
          status: 'success',
          message: 'El script está funcionando.'
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
  } catch (error) {
    Logger.log('Error: ' + error.toString());
    return ContentService
      .createTextOutput(JSON.stringify({ 
        status: 'error',
        message: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function verificarConfirmacion(e) {
  try {
    const invitadoId = e.parameter.invitadoId;
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getActiveSheet();
    
    // Buscar si el invitado ya confirmó
    const data = sheet.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
      if (data[i][1] == invitadoId) { // Columna B contiene invitadoId
        return ContentService
          .createTextOutput(JSON.stringify({ 
            yaConfirmo: true
          }))
          .setMimeType(ContentService.MimeType.JSON);
      }
    }
    
    return ContentService
      .createTextOutput(JSON.stringify({ 
        yaConfirmo: false
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    Logger.log('Error en verificarConfirmacion: ' + error.toString());
    return ContentService
      .createTextOutput(JSON.stringify({ 
        yaConfirmo: false,
        error: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function guardarConfirmacion(e) {
  try {
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getActiveSheet();
    
    Logger.log('Guardando confirmación');
    Logger.log('Parámetros: ' + JSON.stringify(e.parameter));
    
    // Si es la primera vez, agregar encabezados
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'Fecha',
        'ID Invitado',
        'Nombre',
        'Email',
        'Teléfono',
        'Asistencia',
        'Asistentes',
        'Faltantes',
        'Observaciones'
      ]);
    }
    
    // Agregar nueva fila con los datos
    sheet.appendRow([
      new Date(),
      e.parameter.invitadoId || '',
      e.parameter.nombre || '',
      e.parameter.email || '',
      e.parameter.telefono || '',
      e.parameter.asistencia || '',
      e.parameter.asistentes || 0,
      e.parameter.faltantes || '',
      e.parameter.observaciones || ''
    ]);
    
    return ContentService
      .createTextOutput(JSON.stringify({ 
        status: 'success',
        message: 'Confirmación guardada correctamente'
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    Logger.log('Error en guardarConfirmacion: ' + error.toString());
    return ContentService
      .createTextOutput(JSON.stringify({ 
        status: 'error',
        message: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  // Por compatibilidad, redirigir a doGet
  return doGet(e);
}
