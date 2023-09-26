const ResponseFormatter = function(success, message, result = [], pageNo = 1, itemsNoPerPages = 1, totalPages = 1) {
    return {
        success: success,
        message: message,
        pageNo: pageNo,
        itemsNoPerPages: result.length,
        totalPages: totalPages,
        data: result
    }
}
module.exports = ResponseFormatter;