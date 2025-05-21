function doGet(e) {
  const params = e.parameter;

  if (params.flatRates !== undefined) {
    return ContentService.createTextOutput(JSON.stringify(getFlatRates()))
      .setMimeType(ContentService.MimeType.JSON);
  }

  if (params.checkPromo !== undefined) {
    const promoData = checkPromoCode(params.checkPromo);
    return ContentService.createTextOutput(JSON.stringify(promoData))
      .setMimeType(ContentService.MimeType.JSON);
  }

  return ContentService.createTextOutput(JSON.stringify({ error: 'Invalid request' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function getFlatRates() {
  const sheet = SpreadsheetApp.getActive().getSheetByName("Flat Rates");
  const data = sheet.getRange("A2:C30").getValues();

  return data
    .filter(row => row[0] && row[1] && row[2])
    .map(row => ({
      location1: row[0],
      location2: row[1],
      amount: row[2],
    }));
}

function checkPromoCode(code) {
  const sheet = SpreadsheetApp.getActive().getSheetByName("Promo Codes");
  const data = sheet.getRange("A1:L50").getValues();

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const [codeVal, , lat1, lng1, radius1, , lat2, lng2, radius2, multiplier, isActive] = row;

    if (
      codeVal === code &&
      isActive === true &&
      codeVal && lat1 && lng1 && radius1
    ) {
      return {
        code: codeVal,
        lat1: lat1,
        lng1: lng1,
        radius1: radius1,
        lat2: lat2,
        lng2: lng2,
        radius2: radius2,
        multiplier: multiplier,
      };
    }
  }

  return null;
}
