const serverId = document.getElementById('retired-server-id').value

const baseUrl = document.getElementById('base-url').value

const btnConfirmUpdate = document.getElementById('btn-confirm-update')

$('.datepicker-input').datepicker({
    format: 'dd/mm/yyyy',
    language: 'pt-BR'
})

btnConfirmUpdate.addEventListener('click', async (e) => {    
    e.target.disabled = true

    const btnEditPersonalData = document.getElementById('btn-personal-data-edit')
    const btnEditDependants = document.getElementById('btn-dependants-edit-hide-show-form')
    const btnEditDocuments = document.getElementById('btn-documents-edit')
    const btnEditLegalRepresentant = document.getElementById('btn-representant-edit-hide-show-form')

    btnEditPersonalData.disabled = true
    btnEditDocuments.disabled = true
    
    if (btnEditDependants) {
        btnEditDependants.disabled = true
    }

    if (btnEditLegalRepresentant) {
        btnEditLegalRepresentant.disabled = true
    }

    const fetchOptions = {
        method: 'POST',
        headers: {
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
        }
    }

    await fetch(baseUrl + 'atualizacao-cadastral/confirmar', fetchOptions)
        .then(response => response.json())
        .then(res => {
            if (! res.success) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Houve um problema ao confirmar os dados',
                });

                e.target.disabled = false

                btnEditPersonalData.disabled = false
                btnEditDocuments.disabled = false
                
                if (btnEditDependants) {
                    btnEditDependants.disabled = false
                }

                if (btnEditLegalRepresentant) {
                    btnEditLegalRepresentant.disabled = false
                }

                return
            }

            Swal.fire({icon: 'success', text: res.message})

            const pConfirmData = document.getElementById('has-confirm-data')

            e.target.innerHTML = ''

            e.target.innerText = 'Reenviar atualização cadastral'

            e.target.disabled = false

            btnEditPersonalData.disabled = false
            btnEditDocuments.disabled = false
            
            if (btnEditDependants) {
                btnEditDependants.disabled = false
            }

            if (btnEditLegalRepresentant) {
                btnEditLegalRepresentant.disabled = false
            }

            pConfirmData.textContent = '';

            if (Object.keys(res.updated).length === 0) {
                pConfirmData.innerHTML = `Confirmação de dados registrada em <br />${res.created.date} às ${res.created.time}`

                return
            }

            pConfirmData.innerHTML = `Confirmação de dados atualizada em <br/>${res.updated.date} às ${res.updated.time}`            
        })    
})

function removeAllCharacters(string) {
    if (! string) {
        return null
    }

    return string.replace(/\D/g, '')
}

function formatDocumentRG(documentRg) {
    return documentRg.trim().replace(/\./g, '');
}

// Format date to yyyy-mm-dd
function formatDateToISO(datePtBr) {
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(datePtBr)) {
    throw new Error('Data inválida. Use o formato dd/mm/aaaa')
  }

  const [day, month, year] = datePtBr.split('/')

  return `${year}-${month}-${day}`
}

// Format date to dd/mm/yyyy
function formatDateToPtBr(dateISO) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(datePtBr)) {
        throw new Error('Data inválida. Use o formato aaaa-mm-dd')
    }
    const [year, month, date] = dateISO.split('-')

    return `${date}/${month}/${year}`
}

function isValidDocumentCpf(input)
{
    value = removeAllCharacters(input.value)

    if (value.length == 0) {
        return
    }

    if (value.length != 11) {
        return false
    }

    if (/^(\d)\1{10}$/.test(value)) {
        return false
    }

    for (let t = 9; t <= 10; t++) {
        let sum = 0;
    
        for (let i = 0; i < t; i++) {
            sum += parseInt(value[i]) * (t + 1 - i)
        }

        let digit = (sum * 10) % 11

        if (digit === 10) {
            digit = 0
        }
            
        if (parseInt(value[t]) !== digit) {
            return false
        }
    }

    return true
}

function setDocumentCpfMask(input)
{
    value = removeAllCharacters(input.value)

    if (value.length == 0) {
        return
    }
    
    if (value.length === 11) {
        value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
    }

    input.value = value
}

function setDocumentRgMask(input)
{
    let value = input.value.replace(/\D/g, '')

    if (value.length == 0) {
        return
    }

    value = value.slice(0, 9)

    const patterns = {
        7: [/(\d{1})(\d{3})(\d{2})(\d{1})/, '$1.$2.$3-$4'],
        8: [/(\d{1})(\d{3})(\d{3})(\d{1})/, '$1.$2.$3-$4'],
        9: [/(\d{2})(\d{3})(\d{3})(\d{1})/, '$1.$2.$3-$4'],
    }

    const pattern = patterns[value.length]

    if (pattern) {
        value = value.replace(pattern[0], pattern[1])
    }

    input.value = value
}

function isValidRg(rg) {
    if (!rg) return false;

    const rgStripped = rg.replace(/\D/g, '');

    if (rgStripped.length < 7 || rgStripped.length > 9) {
        return false;
    }

    if (/^(\d)\1+$/.test(rgStripped)) {
        return false;
    }

    if (/^(?:012345678|987654321)$/.test(rgStripped)) {
        return false;
    }

    return true;
}


function onlyNumbers(event) {
    const charCode = event.charCode ? event.charCode : event.keyCode;

    if (charCode < 48 || charCode > 57) {
        event.preventDefault();

        return false;
    }

    return true;
}

function emptyFields(fieldsElements)
{
    const fields = []

    Array.from(fieldsElements).forEach(field => {        
        if (field.value == '') {
            fields.push(field.dataset.label)
        }
    })

    return fields
}

function checkIfElementExists(element) {
    if (! element) {
        return false
    }

    return true
}

function checkIfElementExistsInCollection(HtmlCollection, elementId)
{
    if (HtmlCollection.length == 0) {
        return false
    }

    const element = document.getElementById(elementId)

    return Array.from(HtmlCollection).includes(element)
}

function emptyRequiredFileInputs(fileInputs, inputsDisabled)
{
    const fields = []

    if (checkIfElementExistsInCollection(fileInputs, 'documents-address-new')) {
        if (fileInputs['documents-address-new'].files.length == 0) {
            fields.push(fileInputs['documents-address-new'].dataset.label)
        }
    }

    if (checkIfElementExistsInCollection(fileInputs, 'documents-address-edit')) {
        if (fileInputs['documents-address-edit'].files.length == 0 && ! inputsDisabled['documents-address-edit-name'].value) {
            fields.push(fileInputs['documents-address-edit'].dataset.label)
        }
    }

    if (checkIfElementExistsInCollection(fileInputs, 'documents-identification-new')) {
        if (fileInputs['documents-identification-new'].files.length == 0) {
            fields.push(fileInputs['documents-identification-new'].dataset.label)
        }
    }

    if (checkIfElementExistsInCollection(fileInputs, 'documents-identification-edit')) {
        if (fileInputs['documents-identification-edit'].files.length == 0 && ! inputsDisabled['documents-identification-edit-name'].value) {
            fields.push(fileInputs['documents-identification-edit'].dataset.label)
        }
    }

    return fields
}

function preventInvalidPaste(event) {
    const contentPasted = event.clipboardData?.getData('text')

    if (/\D/.test(contentPasted)) {
        event.preventDefault()
    }
}

function setPhoneMask(input) {
    let value = input.value.replace(/\D/g, '').slice(0, 10)

    value = value
        .replace(/^(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{4})(\d{4})$/, '$1-$2')

    input.value = value;
}

function setMobilePhoneMask(input) {
    let value = input.value.replace(/\D/g, '').slice(0, 11)

    value = value
        .replace(/^(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d{4})$/, '$1-$2')

    input.value = value;
}

function setAddressCodeMask(input)
{
    let value = input.value.replace(/\D/g, '').slice(0, 8)

    value = value.replace(/^(\d{5})(\d)/, '$1-$2')

    input.value = value
}

function setDateMask(input) {
    let value = input.value.replace(/\D/g, '').slice(0, 8)

    if (value.length < 6) {
        return
    }

    value = value.replace(/^(\d{2})(\d{2})(\d{4})$/, '$1/$2/$3')

    input.value = value
}

function checkValidAddressCode(value) {
    if (! value || value.length !== 9) {
        return false
    }

    const regex = /^\d{5}-\d{3}$/

    return regex.test(value)
}

function checkValidPhone(value) {
    if (! value || value.length < 14) {
        return false
    }

    const regex = /^\(\d{2}\) \d{4}-\d{4}$/

    return regex.test(value)
}

function checkValidMobile(value) {
    if (! value || value.length < 15) {
        return false
    }

    const regex = /^\(\d{2}\) 9\d{4}-\d{4}$/

    return regex.test(value)
}

function checkRepresentationDates(startTime, endTime)
{
    const convertedStartDate = new Date(formatDateToISO(startTime))
    const convertedEndDate = new Date(formatDateToISO(endTime))

    if (convertedStartDate >= convertedEndDate) {
        return false
    }

    return true
}


