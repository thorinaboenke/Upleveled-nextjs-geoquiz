import {
  random,
  createUniqueRandomIndexArray,
  createQuestionArray,
} from '../functions';
// import { countries } from './countries';

test('creates an array of unique Indices', () => {
  const randomIndexArray = createUniqueRandomIndexArray(5, [
    0,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
  ]);
  expect(randomIndexArray.length).toBe(5);
  function checkForDuplicates(array) {
    const valuesAlreadySeen = [];

    for (let i = 0; i < array.length; i++) {
      const value = array[i];
      if (valuesAlreadySeen.indexOf(value) !== -1) {
        return true;
      }
      valuesAlreadySeen.push(value);
    }
    return false;
  }
  expect(checkForDuplicates(randomIndexArray)).toBe(false);
});

test('creates an array of quiz Questions', () => {
  const NumberOfQuestions = 5;
  const answerPossibilities = 4;
  const newQuestions = createQuestionArray(
    NumberOfQuestions,
    answerPossibilities,
    countries,
    'flag',
    'name',
    'Americas',
  );

  // correct number of Questions
  expect(newQuestions.length).toEqual(NumberOfQuestions);
  // correct number of answerOptions
  expect(newQuestions[0].answerOptions.length).toEqual(answerPossibilities);
  const expectedKeys = ['question', 'answerOptions'];
  const expectedKeysOption = ['isCorrect', 'answer'];
  // correct keys for each Question
  expect(Object.keys(newQuestions[0])).toEqual(
    expect.arrayContaining(expectedKeys),
  );
  //correct keys for each answer option
  expect(Object.keys(newQuestions[0].answerOptions[0])).toEqual(
    expect.arrayContaining(expectedKeysOption),
  );
  // only one answer is marked as true
  expect(
    newQuestions[0].answerOptions.filter((option) => option.isCorrect).length,
  ).toEqual(1);
});

const countries = [
  {
    flag: 'https://restcountries.eu/data/afg.svg',
    name: 'Afghanistan',
    capital: 'Kabul',
    region: 'Asia',
  },
  {
    flag: 'https://restcountries.eu/data/alb.svg',
    name: 'Albania',
    capital: 'Tirana',
    region: 'Europe',
  },
  {
    flag: 'https://restcountries.eu/data/dza.svg',
    name: 'Algeria',
    capital: 'Algiers',
    region: 'Africa',
  },
  {
    flag: 'https://restcountries.eu/data/and.svg',
    name: 'Andorra',
    capital: 'Andorra la Vella',
    region: 'Europe',
  },
  {
    flag: 'https://restcountries.eu/data/ago.svg',
    name: 'Angola',
    capital: 'Luanda',
    region: 'Africa',
  },
  {
    flag: 'https://restcountries.eu/data/atg.svg',
    name: 'Antigua and Barbuda',
    capital: "Saint John's",
    region: 'Americas',
  },
  {
    flag: 'https://restcountries.eu/data/arg.svg',
    name: 'Argentina',
    capital: 'Buenos Aires',
    region: 'Americas',
  },
  {
    flag: 'https://restcountries.eu/data/arm.svg',
    name: 'Armenia',
    capital: 'Yerevan',
    region: 'Asia',
  },
  {
    flag: 'https://restcountries.eu/data/aus.svg',
    name: 'Australia',
    capital: 'Canberra',
    region: 'Oceania',
  },
  {
    flag: 'https://restcountries.eu/data/aut.svg',
    name: 'Austria',
    capital: 'Vienna',
    region: 'Europe',
  },
  {
    flag: 'https://restcountries.eu/data/aze.svg',
    name: 'Azerbaijan',
    capital: 'Baku',
    region: 'Asia',
  },
  {
    flag: 'https://restcountries.eu/data/bhs.svg',
    name: 'Bahamas',
    capital: 'Nassau',
    region: 'Americas',
  },
  {
    flag: 'https://restcountries.eu/data/bhr.svg',
    name: 'Bahrain',
    capital: 'Manama',
    region: 'Asia',
  },
  {
    flag: 'https://restcountries.eu/data/bgd.svg',
    name: 'Bangladesh',
    capital: 'Dhaka',
    region: 'Asia',
  },
  {
    flag: 'https://restcountries.eu/data/brb.svg',
    name: 'Barbados',
    capital: 'Bridgetown',
    region: 'Americas',
  },
  {
    flag: 'https://restcountries.eu/data/blr.svg',
    name: 'Belarus',
    capital: 'Minsk',
    region: 'Europe',
  },
  {
    flag: 'https://restcountries.eu/data/bel.svg',
    name: 'Belgium',
    capital: 'Brussels',
    region: 'Europe',
  },
  {
    flag: 'https://restcountries.eu/data/blz.svg',
    name: 'Belize',
    capital: 'Belmopan',
    region: 'Americas',
  },
  {
    flag: 'https://restcountries.eu/data/ben.svg',
    name: 'Benin',
    capital: 'Porto-Novo',
    region: 'Africa',
  },
  {
    flag: 'https://restcountries.eu/data/btn.svg',
    name: 'Bhutan',
    capital: 'Thimphu',
    region: 'Asia',
  },
  {
    flag: 'https://restcountries.eu/data/bol.svg',
    name: 'Bolivia',
    capital: 'Sucre',
    region: 'Americas',
  },
  {
    flag: 'https://restcountries.eu/data/bih.svg',
    name: 'Bosnia and Herzegovina',
    capital: 'Sarajevo',
    region: 'Europe',
  },
  {
    flag: 'https://restcountries.eu/data/bwa.svg',
    name: 'Botswana',
    capital: 'Gaborone',
    region: 'Africa',
  },
  {
    flag: 'https://restcountries.eu/data/bra.svg',
    name: 'Brazil',
    capital: 'Brasília',
    region: 'Americas',
  },
  {
    flag: 'https://restcountries.eu/data/brn.svg',
    name: 'Brunei',
    capital: 'Bandar Seri Begawan',
    region: 'Asia',
  },
  {
    flag: 'https://restcountries.eu/data/bgr.svg',
    name: 'Bulgaria',
    capital: 'Sofia',
    region: 'Europe',
  },
  {
    flag: 'https://restcountries.eu/data/bfa.svg',
    name: 'Burkina Faso',
    capital: 'Ouagadougou',
    region: 'Africa',
  },
  {
    flag: 'https://restcountries.eu/data/bdi.svg',
    name: 'Burundi',
    capital: 'Bujumbura',
    region: 'Africa',
  },
  {
    flag: 'https://restcountries.eu/data/khm.svg',
    name: 'Cambodia',
    capital: 'Phnom Penh',
    region: 'Asia',
  },
  {
    flag: 'https://restcountries.eu/data/cmr.svg',
    name: 'Cameroon',
    capital: 'Yaoundé',
    region: 'Africa',
  },
  {
    flag: 'https://restcountries.eu/data/can.svg',
    name: 'Canada',
    capital: 'Ottawa',
    region: 'Americas',
  },
  {
    flag: 'https://restcountries.eu/data/cpv.svg',
    name: 'Cabo Verde',
    capital: 'Praia',
    region: 'Africa',
  },
  {
    flag: 'https://restcountries.eu/data/caf.svg',
    name: 'Central African Republic',
    capital: 'Bangui',
    region: 'Africa',
  },
  {
    flag: 'https://restcountries.eu/data/tcd.svg',
    name: 'Chad',
    capital: "N'Djamena",
    region: 'Africa',
  },
  {
    flag: 'https://restcountries.eu/data/chl.svg',
    name: 'Chile',
    capital: 'Santiago',
    region: 'Americas',
  },
  {
    flag: 'https://restcountries.eu/data/chn.svg',
    name: 'China',
    capital: 'Beijing',
    region: 'Asia',
  },
  {
    flag: 'https://restcountries.eu/data/col.svg',
    name: 'Colombia',
    capital: 'Bogotá',
    region: 'Americas',
  },
  {
    flag: 'https://restcountries.eu/data/com.svg',
    name: 'Comoros',
    capital: 'Moroni',
    region: 'Africa',
  },
  {
    flag: 'https://restcountries.eu/data/cog.svg',
    name: 'Congo',
    capital: 'Brazzaville',
    region: 'Africa',
  },
  {
    flag: 'https://restcountries.eu/data/cod.svg',
    name: 'Democratic Republic of the Congo',
    capital: 'Kinshasa',
    region: 'Africa',
  },
  {
    flag: 'https://restcountries.eu/data/cri.svg',
    name: 'Costa Rica',
    capital: 'San José',
    region: 'Americas',
  },
  {
    flag: 'https://restcountries.eu/data/hrv.svg',
    name: 'Croatia',
    capital: 'Zagreb',
    region: 'Europe',
  },
  {
    flag: 'https://restcountries.eu/data/cub.svg',
    name: 'Cuba',
    capital: 'Havana',
    region: 'Americas',
  },
  {
    flag: 'https://restcountries.eu/data/cyp.svg',
    name: 'Cyprus',
    capital: 'Nicosia',
    region: 'Europe',
  },
  {
    flag: 'https://restcountries.eu/data/cze.svg',
    name: 'Czech Republic',
    capital: 'Prague',
    region: 'Europe',
  },
  {
    flag: 'https://restcountries.eu/data/dnk.svg',
    name: 'Denmark',
    capital: 'Copenhagen',
    region: 'Europe',
  },
  {
    flag: 'https://restcountries.eu/data/dji.svg',
    name: 'Djibouti',
    capital: 'Djibouti',
    region: 'Africa',
  },
  {
    flag: 'https://restcountries.eu/data/dma.svg',
    name: 'Dominica',
    capital: 'Roseau',
    region: 'Americas',
  },
  {
    flag: 'https://restcountries.eu/data/dom.svg',
    name: 'Dominican Republic',
    capital: 'Santo Domingo',
    region: 'Americas',
  },
  {
    flag: 'https://restcountries.eu/data/ecu.svg',
    name: 'Ecuador',
    capital: 'Quito',
    region: 'Americas',
  },
  {
    flag: 'https://restcountries.eu/data/egy.svg',
    name: 'Egypt',
    capital: 'Cairo',
    region: 'Africa',
  },
  {
    flag: 'https://restcountries.eu/data/slv.svg',
    name: 'El Salvador',
    capital: 'San Salvador',
    region: 'Americas',
  },
  {
    flag: 'https://restcountries.eu/data/gnq.svg',
    name: 'Equatorial Guinea',
    capital: 'Malabo',
    region: 'Africa',
  },
  {
    flag: 'https://restcountries.eu/data/eri.svg',
    name: 'Eritrea',
    capital: 'Asmara',
    region: 'Africa',
  },
  {
    flag: 'https://restcountries.eu/data/est.svg',
    name: 'Estonia',
    capital: 'Tallinn',
    region: 'Europe',
  },
  {
    flag: 'https://restcountries.eu/data/eth.svg',
    name: 'Ethiopia',
    capital: 'Addis Ababa',
    region: 'Africa',
  },
  {
    flag: 'https://restcountries.eu/data/fji.svg',
    name: 'Fiji',
    capital: 'Suva',
    region: 'Oceania',
  },
  {
    flag: 'https://restcountries.eu/data/fin.svg',
    name: 'Finland',
    capital: 'Helsinki',
    region: 'Europe',
  },
  {
    flag: 'https://restcountries.eu/data/fra.svg',
    name: 'France',
    capital: 'Paris',
    region: 'Europe',
  },
  {
    flag: 'https://restcountries.eu/data/gab.svg',
    name: 'Gabon',
    capital: 'Libreville',
    region: 'Africa',
  },
  {
    flag: 'https://restcountries.eu/data/gmb.svg',
    name: 'Gambia',
    capital: 'Banjul',
    region: 'Africa',
  },
  {
    flag: 'https://restcountries.eu/data/geo.svg',
    name: 'Georgia',
    capital: 'Tbilisi',
    region: 'Asia',
  },
  {
    flag: 'https://restcountries.eu/data/deu.svg',
    name: 'Germany',
    capital: 'Berlin',
    region: 'Europe',
  },
  {
    flag: 'https://restcountries.eu/data/gha.svg',
    name: 'Ghana',
    capital: 'Accra',
    region: 'Africa',
  },
  {
    flag: 'https://restcountries.eu/data/grc.svg',
    name: 'Greece',
    capital: 'Athens',
    region: 'Europe',
  },
  {
    flag: 'https://restcountries.eu/data/grd.svg',
    name: 'Grenada',
    capital: "St. George's",
    region: 'Americas',
  },
  {
    flag: 'https://restcountries.eu/data/gtm.svg',
    name: 'Guatemala',
    capital: 'Guatemala City',
    region: 'Americas',
  },
  {
    flag: 'https://restcountries.eu/data/gin.svg',
    name: 'Guinea',
    capital: 'Conakry',
    region: 'Africa',
  },
  {
    flag: 'https://restcountries.eu/data/gnb.svg',
    name: 'Guinea-Bissau',
    capital: 'Bissau',
    region: 'Africa',
  },
  {
    flag: 'https://restcountries.eu/data/guy.svg',
    name: 'Guyana',
    capital: 'Georgetown',
    region: 'Americas',
  },
  {
    flag: 'https://restcountries.eu/data/hti.svg',
    name: 'Haiti',
    capital: 'Port-au-Prince',
    region: 'Americas',
  },
  {
    flag: 'https://restcountries.eu/data/vat.svg',
    name: 'Vatican City (Holy See)',
    capital: 'Rome',
    region: 'Europe',
  },
  {
    flag: 'https://restcountries.eu/data/hnd.svg',
    name: 'Honduras',
    capital: 'Tegucigalpa',
    region: 'Americas',
  },
  {
    flag: 'https://restcountries.eu/data/hun.svg',
    name: 'Hungary',
    capital: 'Budapest',
    region: 'Europe',
  },
  {
    flag: 'https://restcountries.eu/data/isl.svg',
    name: 'Iceland',
    capital: 'Reykjavík',
    region: 'Europe',
  },
  {
    flag: 'https://restcountries.eu/data/ind.svg',
    name: 'India',
    capital: 'New Delhi',
    region: 'Asia',
  },
  {
    flag: 'https://restcountries.eu/data/idn.svg',
    name: 'Indonesia',
    capital: 'Jakarta',
    region: 'Asia',
  },
  {
    flag: 'https://restcountries.eu/data/civ.svg',
    name: "Côte d'Ivoire",
    capital: 'Yamoussoukro',
    region: 'Africa',
  },
  {
    flag: 'https://restcountries.eu/data/irn.svg',
    name: 'Iran',
    capital: 'Tehran',
    region: 'Asia',
  },
  {
    flag: 'https://restcountries.eu/data/irq.svg',
    name: 'Iraq',
    capital: 'Baghdad',
    region: 'Asia',
  },
  {
    flag: 'https://restcountries.eu/data/irl.svg',
    name: 'Ireland',
    capital: 'Dublin',
    region: 'Europe',
  },
  {
    flag: 'https://restcountries.eu/data/isr.svg',
    name: 'Israel',
    capital: 'Jerusalem',
    region: 'Asia',
  },
  {
    flag: 'https://restcountries.eu/data/ita.svg',
    name: 'Italy',
    capital: 'Rome',
    region: 'Europe',
  },
  {
    flag: 'https://restcountries.eu/data/jam.svg',
    name: 'Jamaica',
    capital: 'Kingston',
    region: 'Americas',
  },
  {
    flag: 'https://restcountries.eu/data/jpn.svg',
    name: 'Japan',
    capital: 'Tokyo',
    region: 'Asia',
  },
  {
    flag: 'https://restcountries.eu/data/jor.svg',
    name: 'Jordan',
    capital: 'Amman',
    region: 'Asia',
  },
  {
    flag: 'https://restcountries.eu/data/kaz.svg',
    name: 'Kazakhstan',
    capital: 'Astana',
    region: 'Asia',
  },
  {
    flag: 'https://restcountries.eu/data/ken.svg',
    name: 'Kenya',
    capital: 'Nairobi',
    region: 'Africa',
  },
  {
    flag: 'https://restcountries.eu/data/kir.svg',
    name: 'Kiribati',
    capital: 'South Tarawa',
    region: 'Oceania',
  },
  {
    flag: 'https://restcountries.eu/data/kwt.svg',
    name: 'Kuwait',
    capital: 'Kuwait City',
    region: 'Asia',
  },
  {
    flag: 'https://restcountries.eu/data/kgz.svg',
    name: 'Kyrgyzstan',
    capital: 'Bishkek',
    region: 'Asia',
  },
  {
    flag: 'https://restcountries.eu/data/lao.svg',
    name: 'Laos',
    capital: 'Vientiane',
    region: 'Asia',
  },
  {
    flag: 'https://restcountries.eu/data/lva.svg',
    name: 'Latvia',
    capital: 'Riga',
    region: 'Europe',
  },
  {
    flag: 'https://restcountries.eu/data/lbn.svg',
    name: 'Lebanon',
    capital: 'Beirut',
    region: 'Asia',
  },
  {
    flag: 'https://restcountries.eu/data/lso.svg',
    name: 'Lesotho',
    capital: 'Maseru',
    region: 'Africa',
  },
  {
    flag: 'https://restcountries.eu/data/lbr.svg',
    name: 'Liberia',
    capital: 'Monrovia',
    region: 'Africa',
  },
  {
    flag: 'https://restcountries.eu/data/lby.svg',
    name: 'Libya',
    capital: 'Tripoli',
    region: 'Africa',
  },
  {
    flag: 'https://restcountries.eu/data/lie.svg',
    name: 'Liechtenstein',
    capital: 'Vaduz',
    region: 'Europe',
  },
  {
    flag: 'https://restcountries.eu/data/ltu.svg',
    name: 'Lithuania',
    capital: 'Vilnius',
    region: 'Europe',
  },
  {
    flag: 'https://restcountries.eu/data/lux.svg',
    name: 'Luxembourg',
    capital: 'Luxembourg',
    region: 'Europe',
  },
  {
    flag: 'https://restcountries.eu/data/mkd.svg',
    name: 'Macedonia',
    capital: 'Skopje',
    region: 'Europe',
  },
  {
    flag: 'https://restcountries.eu/data/mdg.svg',
    name: 'Madagascar',
    capital: 'Antananarivo',
    region: 'Africa',
  },
  {
    flag: 'https://restcountries.eu/data/mwi.svg',
    name: 'Malawi',
    capital: 'Lilongwe',
    region: 'Africa',
  },
  {
    flag: 'https://restcountries.eu/data/mys.svg',
    name: 'Malaysia',
    capital: 'Kuala Lumpur',
    region: 'Asia',
  },
  {
    flag: 'https://restcountries.eu/data/mdv.svg',
    name: 'Maldives',
    capital: 'Malé',
    region: 'Asia',
  },
];
