export function ErrorState(state, reason) {
    this.state = state;
    this.reason = reason;
}

export function validateIpAddress (value) {
    return /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(value);
}

//this utility function returns true if any of the objects value is true
export function anyStateTrue(obj) {
    for(var o in obj) {
        if(obj[o].state) {
            return true;
        }
    }
    return false;
}

export const validateEmail = (mail) => {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail);
}

export function handleChangeCommon(event, validation, errorStates, setErrorStates, details, setDetails, setDisableSubmit) {
    let newErrorStates = {...errorStates};
    let name = event.target.name;
    let value = event.target.value
    if (validation[name]) {
        let test = validation[name];
        if (test.regex) {
            let regex = RegExp(test.regex);
            if (regex.test(value)) {
                newErrorStates = {...newErrorStates, [name]: new ErrorState(false, '')};
            } else {
                if (value) {
                    newErrorStates = {...newErrorStates, [name]: new ErrorState(true, 'Not valid!')};
                } else {
                    newErrorStates = {...newErrorStates, [name]: new ErrorState(false, '')};
                }
            }
        }
        if (test.required) {
            if (!value || value.length == 0) {
                newErrorStates = {...newErrorStates, [name]: new ErrorState(true, '')};
            } else if (!test.regex) {
                newErrorStates = {...newErrorStates, [name]: new ErrorState(false, '')};
            }
        }
    }
    setDisableSubmit(anyStateTrue(newErrorStates));
    setErrorStates(newErrorStates);
    setDetails({...details, [name]: value});
}

export function calculateErrorStates(event, validation, errorStates) {
    let newErrorStates = {...errorStates};
    let name = event.target.name;
    let value = event.target.value
    if (validation[name]) {
        let test = validation[name];
        if (test.regex) {
            let regex = RegExp(test.regex);
            if (regex.test(value)) {
                newErrorStates = {...newErrorStates, [name]: new ErrorState(false, '')};
            } else {
                if (value) {
                    newErrorStates = {...newErrorStates, [name]: new ErrorState(true, 'Not valid!')};
                } else {
                    newErrorStates = {...newErrorStates, [name]: new ErrorState(false, '')};
                }
            }
        }
        if (test.required) {
            if (!value || value.length == 0) {
                newErrorStates = {...newErrorStates, [name]: new ErrorState(true, '')};
            } else if (!test.regex) {
                newErrorStates = {...newErrorStates, [name]: new ErrorState(false, '')};
            }
        }
    }
    return newErrorStates;
}

export function ValidationParams(required, regex) {
    this.required = typeof required === 'boolean' ? required : undefined;
    this.regex = typeof regex === 'string' ? regex : undefined;
}

export function removeDuplicates(data) {
    return data.filter((value, index) => data.indexOf(value) === index);
}

export const AddToObject = function (obj, key, value, index) {

    // Create a temp object and index variable
    const temp = {};
    let i = 0;

    // Loop through the original object
    for (const prop in obj) {
        if (obj.hasOwnProperty(prop)) {

            // If the indexes match, add the new item
            if (i === index && key && value) {
                temp[key] = value;
            }

            // Add the current item in the loop to the temp obj
            temp[prop] = obj[prop];

            // Increase the count
            i++;

        }
    }

    // If no index, add to the end
    if (!index && key && value) {
        temp[key] = value;
    }

    return temp;

};