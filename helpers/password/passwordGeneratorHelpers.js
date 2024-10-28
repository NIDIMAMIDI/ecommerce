import generator from 'generate-password';

// generates random password

// export const randomPasswordGenerator = async () => {
//   return generator.generate({
//     length: 12,
//     numbers: true,
//     uppercase: true,
//     lowercase: true
//     // symbols:true
//   });
// };

const strongPasswordRegex =
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,15}$/;

export const randomPasswordGenerator = async () => {
  let password;
  do {
    password = generator.generate({
      length: 12,
      numbers: true,
      uppercase: true,
      lowercase: true,
      symbols: true,
      strict: true // Ensures at least one character from each pool is present
    });
  } while (!strongPasswordRegex.test(password));

  return password;
};
