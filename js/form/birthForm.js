export function getBirthFormData() {
  const gender =
    document.querySelector(
      'input[name="gender"]:checked'
    )?.value;

  const calendar =
    document.querySelector(
      'input[name="calendar"]:checked'
    )?.value;

  const birthDate =
    document.getElementById("birthDate").value;

  const birthTime =
    document.getElementById("birthTime").value;

  const unknownTime =
    document.getElementById("unknownTime").checked;

  const birthPlace =
    document.getElementById("birthPlace").value;

  const isLeapMonth =
    document.getElementById("leapMonth").checked;

  if (!birthDate) {
    alert("생년월일을 입력해주세요.");
    return null;
  }

  if (!birthPlace) {
    alert("태어난 지역을 선택해주세요.");
    return null;
  }

  if (!unknownTime && !birthTime) {
    alert("태어난 시간을 입력해주세요.");
    return null;
  }

  const [year, month, day] =
    birthDate.split("-").map(Number);

  let hour = 12;
  let minute = 0;

  if (!unknownTime) {
    [hour, minute] =
      birthTime.split(":").map(Number);
  }

  return {
    gender,
    calendar,

    year,
    month,
    day,

    hour,
    minute,

    unknownTime,

    isLunar:
      calendar === "lunar",

    isLeapMonth,

    birthPlace
  };
}