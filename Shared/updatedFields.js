const updatedFields = function(request, fieldsThatAllowToUpdate) {
    const targetFields = {};
    for(const prop of fieldsThatAllowToUpdate) {
        if(request.body[prop] !== undefined) {
            targetFields[prop] = request.body[prop];
        }
    }
    return targetFields;
}

module.exports = updatedFields;