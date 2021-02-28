/**
 * Демо данные запроса
 * @type {string}
 */
const demoJson = `{
    "order" : {
        "id" : 1000,
        "name" : 1000,
        "symbol" : "symbol_name",
        "amount" : 100,
        "price" : 3450
    },
    "process" : {
        "type" : "type_name",
        "time" : "12021-02-28t14:50:00z",
        "range" : "10min"
    },
    "info" : {
        "buy_info" : "busket",
        "person" : "Alex Name"
    }
}`;

/**
 * Сохранённые ранее заказы
 * @type {{buy_info: string, name: number, id: number}[]}
 */
const ourDataForComparison = [
    {
        'id': 1000,
        'name': 1000,
        'buy_info': 'busket'
    },
    {
        'id': 10001,
        'name': 1000,
        'buy_info': 'busket2'
    }
];

/**
 * Список свойств которые пойдут в сниппет
 * @type {{свойство1: string, свойство2: string, order: [string, string, string, string, string], info: [string]}}
 */
const fieldsToSnippet = {
    'order': [
        'id', 'name', 'symbol', 'amount', 'price'
    ],
    'info': [
        'buy_info'
    ],
    'свойство1': 'значение 1',
    'свойство2': 'значение 2'
};

/**
 * Свойства по которым идёт сравнение на наличе в прошлых заказах
 * @type {string[]}
 */
const fieldsCompare = ['id', 'buy_info'];

let resultStrinSnippet = convertRequestJsonToSnippet(
    demoJson,
    fieldsToSnippet,
    ourDataForComparison,
    fieldsCompare
);

alert(resultStrinSnippet);

/**
 * @param stringJson Строка json
 * @param options Объект со списком свойств которые будут браться из json и конвертится в строку
 * {
 *      'order': [
 *          'id', 'name', 'symbol', 'amount', 'price'
 *      ],
 *      'info': [
 *          'buy_info'
 *      ],
 *
 *      //  Пользовательские свойства
 *      'свойство1': 'значение 1',
 *      'свойство2': 'значение 2'
 * }
 * @param ourDataForComparison Данные с которыми мы сравниваем результат
 * @param fieldsForComparison Массив свойств по которым идёт сравнение
 * @return string | null
 */
function convertRequestJsonToSnippet (stringJson, options, ourDataForComparison, fieldsForComparison) {
    let requestObj = JSON.parse(stringJson);

    let resultString = '';
    let resultArray = [];
    let resultOrderPropsArray = [];
    let resultUserPropsArray = [];

    let isExistPropertyInRequestObject;
    let optionName;
    let orderPropString;

    for (optionName in options) {
        isExistPropertyInRequestObject = requestObj.hasOwnProperty(optionName);

        // Обрабатываем свойства заказа
        if (isExistPropertyInRequestObject) {
            orderPropString = processingPropertiesInObject(requestObj[optionName], options[optionName])
            resultOrderPropsArray = resultOrderPropsArray.concat(orderPropString);
        }
        // Обрабатываем пользовательские свойства
        else {
            resultUserPropsArray.push(optionName + '=' + options[optionName]);
        }
    }

    resultArray = resultOrderPropsArray.concat(resultUserPropsArray);

    if (searchDataMatches(resultArray, ourDataForComparison, fieldsForComparison)) {
        resultString = resultArray.join(';');
        return resultString;
    }
    else {
        return null;
    }
}

/**
 * Обработка свойств заказа
 * @param requestObj
 * @param options
 * @return {[]}
 */
function processingPropertiesInObject (requestObj, options) {
    let resultPropsArray = [];

    for (let key in options) {
        let objPropName = options[key];
        resultPropsArray.push(objPropName + '=' + requestObj[objPropName]);
    }

    return resultPropsArray;
}

/**
 * Поиск по данным прошлых заказов
 * @param requestDataArray
 * @param ourSavedData
 * @param fieldsForComparison
 * @return {boolean}
 */
function searchDataMatches(requestDataArray, ourSavedData, fieldsForComparison) {
    let key;
    let queryArrayToCompare = {};
    for (key in requestDataArray) {
        let requestParams;
        requestParams = requestDataArray[key].split('=');
        let name = requestParams[0];
        let value = requestParams[1];

        queryArrayToCompare[name] = value;
    }

    let ourSavedDataIterator;
    for (ourSavedDataIterator = 0; ourSavedDataIterator < ourSavedData.length; ourSavedDataIterator++) {
        let trueComparisons = 0;
        let fieldsForComparisonIterator;
        let comparingLine = ourSavedData[ourSavedDataIterator];
        for (fieldsForComparisonIterator = 0; fieldsForComparisonIterator < fieldsForComparison.length; fieldsForComparisonIterator++) {
            let comparingLineFieldName = fieldsForComparison[fieldsForComparisonIterator];
            let comparingLineFieldValue = comparingLine[comparingLineFieldName];

            let isExistProp = queryArrayToCompare.hasOwnProperty(comparingLineFieldName);

            if (isExistProp && queryArrayToCompare[comparingLineFieldName] == comparingLineFieldValue) {
                trueComparisons++;
            }
        }

        // Совпадение по всем свойствам
        if (trueComparisons === fieldsForComparison.length) {
            return true;
        }
    }

    return false;
}