<?php

namespace Database\Seeders;

use App\Models\Dag;
use App\Models\District;
use App\Models\Division;
use App\Models\Mouza;
use App\Models\MouzaMap;
use App\Models\Upazila;
use App\Models\Zil;
use Illuminate\Database\Seeder;

class GeographicalSeeder extends Seeder
{
    private $divisionsData = [
        ['name_en' => 'Dhaka', 'name_bn' => 'ঢাকা', 'bbs_code' => '30'],
        ['name_en' => 'Chittagong', 'name_bn' => 'চট্টগ্রাম', 'bbs_code' => '20'],
        ['name_en' => 'Rajshahi', 'name_bn' => 'রাজশাহী', 'bbs_code' => '50'],
        ['name_en' => 'Khulna', 'name_bn' => 'খুলনা', 'bbs_code' => '40'],
        ['name_en' => 'Barisal', 'name_bn' => 'বরিশাল', 'bbs_code' => '10'],
        ['name_en' => 'Sylhet', 'name_bn' => 'সিলেট', 'bbs_code' => '60'],
        ['name_en' => 'Rangpur', 'name_bn' => 'রংপুর', 'bbs_code' => '55'],
        ['name_en' => 'Mymensingh', 'name_bn' => 'ময়মনসিংহ', 'bbs_code' => '45'],
    ];

    private $districtsData = [
        'Dhaka' => [
            ['name_en' => 'Dhaka', 'name_bn' => 'ঢাকা', 'bbs_code' => '26'],
            ['name_en' => 'Gazipur', 'name_bn' => 'গাজীপুর', 'bbs_code' => '33'],
            ['name_en' => 'Kishoreganj', 'name_bn' => 'কিশোরগঞ্জ', 'bbs_code' => '39'],
            ['name_en' => 'Madaripur', 'name_bn' => 'মাদারীপুর', 'bbs_code' => '54'],
            ['name_en' => 'Manikganj', 'name_bn' => 'মানিকগঞ্জ', 'bbs_code' => '56'],
            ['name_en' => 'Munshiganj', 'name_bn' => 'মুন্সীগঞ্জ', 'bbs_code' => '59'],
            ['name_en' => 'Narayanganj', 'name_bn' => 'নারায়ণগঞ্জ', 'bbs_code' => '67'],
            ['name_en' => 'Narsingdi', 'name_bn' => 'নরসিংদী', 'bbs_code' => '68'],
            ['name_en' => 'Rajbari', 'name_bn' => 'রাজবাড়ী', 'bbs_code' => '82'],
            ['name_en' => 'Shariatpur', 'name_bn' => 'শরীয়তপুর', 'bbs_code' => '86'],
            ['name_en' => 'Tangail', 'name_bn' => 'টাঙ্গাইল', 'bbs_code' => '93'],
            ['name_en' => 'Faridpur', 'name_bn' => 'ফরিদপুর', 'bbs_code' => '29'],
        ],
        'Chittagong' => [
            ['name_en' => 'Bandarban', 'name_bn' => 'বান্দরবান', 'bbs_code' => '03'],
            ['name_en' => 'Brahmanbaria', 'name_bn' => 'ব্রাহ্মণবাড়িয়া', 'bbs_code' => '12'],
            ['name_en' => 'Chandpur', 'name_bn' => 'চাঁদপুর', 'bbs_code' => '13'],
            ['name_en' => 'Chittagong', 'name_bn' => 'চট্টগ্রাম', 'bbs_code' => '15'],
            ['name_en' => 'Comilla', 'name_bn' => 'কুমিল্লা', 'bbs_code' => '19'],
            ['name_en' => 'Cox\'s Bazar', 'name_bn' => 'কক্সবাজার', 'bbs_code' => '22'],
            ['name_en' => 'Feni', 'name_bn' => 'ফেনী', 'bbs_code' => '30'],
            ['name_en' => 'Khagrachhari', 'name_bn' => 'খাগড়াছড়ি', 'bbs_code' => '34'],
            ['name_en' => 'Lakshmipur', 'name_bn' => 'লক্ষ্মীপুর', 'bbs_code' => '47'],
            ['name_en' => 'Noakhali', 'name_bn' => 'নোয়াখালী', 'bbs_code' => '75'],
            ['name_en' => 'Rangamati', 'name_bn' => 'রাঙ্গামাটি', 'bbs_code' => '84'],
        ],
        'Rajshahi' => [
            ['name_en' => 'Bogra', 'name_bn' => 'বগুড়া', 'bbs_code' => '10'],
            ['name_en' => 'Joypurhat', 'name_bn' => 'জয়পুরহাট', 'bbs_code' => '38'],
            ['name_en' => 'Naogaon', 'name_bn' => 'নওগাঁ', 'bbs_code' => '64'],
            ['name_en' => 'Natore', 'name_bn' => 'নাটোর', 'bbs_code' => '69'],
            ['name_en' => 'Nawabganj', 'name_bn' => 'চাঁপাইনবাবগঞ্জ', 'bbs_code' => '70'],
            ['name_en' => 'Pabna', 'name_bn' => 'পাবনা', 'bbs_code' => '76'],
            ['name_en' => 'Rajshahi', 'name_bn' => 'রাজশাহী', 'bbs_code' => '81'],
            ['name_en' => 'Sirajganj', 'name_bn' => 'সিরাজগঞ্জ', 'bbs_code' => '88'],
        ],
        'Khulna' => [
            ['name_en' => 'Bagerhat', 'name_bn' => 'বাগেরহাট', 'bbs_code' => '01'],
            ['name_en' => 'Chuadanga', 'name_bn' => 'চুয়াডাঙ্গা', 'bbs_code' => '18'],
            ['name_en' => 'Jessore', 'name_bn' => 'যশোর', 'bbs_code' => '41'],
            ['name_en' => 'Jhenaidah', 'name_bn' => 'ঝিনাইদহ', 'bbs_code' => '42'],
            ['name_en' => 'Khulna', 'name_bn' => 'খুলনা', 'bbs_code' => '43'],
            ['name_en' => 'Kushtia', 'name_bn' => 'কুষ্টিয়া', 'bbs_code' => '44'],
            ['name_en' => 'Magura', 'name_bn' => 'মাগুরা', 'bbs_code' => '55'],
            ['name_en' => 'Meherpur', 'name_bn' => 'মেহেরপুর', 'bbs_code' => '57'],
            ['name_en' => 'Narail', 'name_bn' => 'নড়াইল', 'bbs_code' => '65'],
            ['name_en' => 'Satkhira', 'name_bn' => 'সাতক্ষীরা', 'bbs_code' => '87'],
        ],
        'Barisal' => [
            ['name_en' => 'Barguna', 'name_bn' => 'বরগুনা', 'bbs_code' => '04'],
            ['name_en' => 'Barisal', 'name_bn' => 'বরিশাল', 'bbs_code' => '06'],
            ['name_en' => 'Bhola', 'name_bn' => 'ভোলা', 'bbs_code' => '09'],
            ['name_en' => 'Jhalokati', 'name_bn' => 'ঝালকাঠি', 'bbs_code' => '42'],
            ['name_en' => 'Patuakhali', 'name_bn' => 'পটুয়াখালী', 'bbs_code' => '78'],
            ['name_en' => 'Pirojpur', 'name_bn' => 'পিরোজপুর', 'bbs_code' => '79'],
        ],
        'Sylhet' => [
            ['name_en' => 'Habiganj', 'name_bn' => 'হবিগঞ্জ', 'bbs_code' => '36'],
            ['name_en' => 'Maulvibazar', 'name_bn' => 'মৌলভীবাজার', 'bbs_code' => '58'],
            ['name_en' => 'Sunamganj', 'name_bn' => 'সুনামগঞ্জ', 'bbs_code' => '90'],
            ['name_en' => 'Sylhet', 'name_bn' => 'সিলেট', 'bbs_code' => '91'],
        ],
        'Rangpur' => [
            ['name_en' => 'Dinajpur', 'name_bn' => 'দিনাজপুর', 'bbs_code' => '27'],
            ['name_en' => 'Gaibandha', 'name_bn' => 'গাইবান্ধা', 'bbs_code' => '32'],
            ['name_en' => 'Kurigram', 'name_bn' => 'কুড়িগ্রাম', 'bbs_code' => '49'],
            ['name_en' => 'Lalmonirhat', 'name_bn' => 'লালমনিরহাট', 'bbs_code' => '46'],
            ['name_en' => 'Nilphamari', 'name_bn' => 'নীলফামারী', 'bbs_code' => '73'],
            ['name_en' => 'Panchagarh', 'name_bn' => 'পঞ্চগড়', 'bbs_code' => '77'],
            ['name_en' => 'Rangpur', 'name_bn' => 'রংপুর', 'bbs_code' => '85'],
            ['name_en' => 'Thakurgaon', 'name_bn' => 'ঠাকুরগাঁও', 'bbs_code' => '94'],
        ],
        'Mymensingh' => [
            ['name_en' => 'Jamalpur', 'name_bn' => 'জামালপুর', 'bbs_code' => '39'],
            ['name_en' => 'Mymensingh', 'name_bn' => 'ময়মনসিংহ', 'bbs_code' => '61'],
            ['name_en' => 'Netrokona', 'name_bn' => 'নেত্রকোণা', 'bbs_code' => '72'],
            ['name_en' => 'Sherpur', 'name_bn' => 'শেরপুর', 'bbs_code' => '89'],
        ],
    ];

    private $upazilasData = [
        'Dhaka' => [
            ['name_en' => 'Dhamrai', 'name_bn' => 'ধামরাই'],
            ['name_en' => 'Dohar', 'name_bn' => 'দোহার'],
            ['name_en' => 'Keraniganj', 'name_bn' => 'কেরাণীগঞ্জ'],
            ['name_en' => 'Nawabganj', 'name_bn' => 'নবাবগঞ্জ'],
            ['name_en' => 'Savar', 'name_bn' => 'সাভার'],
        ],
        'Gazipur' => [
            ['name_en' => 'Gazipur Sadar', 'name_bn' => 'গাজীপুর সদর'],
            ['name_en' => 'Kaliakair', 'name_bn' => 'কালিয়াকৈর'],
            ['name_en' => 'Kapasia', 'name_bn' => 'কাপাসিয়া'],
            ['name_en' => 'Sreepur', 'name_bn' => 'শ্রীপুর'],
            ['name_en' => 'Kaliganj', 'name_bn' => 'কালীগঞ্জ'],
        ],
        'Narayanganj' => [
            ['name_en' => 'Araihazar', 'name_bn' => 'আড়াইহাজার'],
            ['name_en' => 'Bandar', 'name_bn' => 'বন্দর'],
            ['name_en' => 'Narayanganj Sadar', 'name_bn' => 'নারায়ণগঞ্জ সদর'],
            ['name_en' => 'Rupganj', 'name_bn' => 'রূপগঞ্জ'],
            ['name_en' => 'Sonargaon', 'name_bn' => 'সোনারগাঁ'],
        ],
        'Chittagong' => [
            ['name_en' => 'Anwara', 'name_bn' => 'আনোয়ারা'],
            ['name_en' => 'Boalkhali', 'name_bn' => 'বোয়ালখালী'],
            ['name_en' => 'Chandanaish', 'name_bn' => 'চন্দনাইশ'],
            ['name_en' => 'Fatikchhari', 'name_bn' => 'ফটিকছড়ি'],
            ['name_en' => 'Hathazari', 'name_bn' => 'হাটহাজারী'],
            ['name_en' => 'Lohagara', 'name_bn' => 'লোহাগাড়া'],
            ['name_en' => 'Mirsharai', 'name_bn' => 'মিরসরাই'],
            ['name_en' => 'Patiya', 'name_bn' => 'পটিয়া'],
            ['name_en' => 'Rangunia', 'name_bn' => 'রাঙ্গুনিয়া'],
            ['name_en' => 'Raozan', 'name_bn' => 'রাউজান'],
            ['name_en' => 'Sandwip', 'name_bn' => 'সন্দ্বীপ'],
            ['name_en' => 'Satkania', 'name_bn' => 'সাতকানিয়া'],
            ['name_en' => 'Sitakunda', 'name_bn' => 'সীতাকুণ্ড'],
        ],
        'Cox\'s Bazar' => [
            ['name_en' => 'Chakaria', 'name_bn' => 'চকরিয়া'],
            ['name_en' => 'Cox\'s Bazar Sadar', 'name_bn' => 'কক্সবাজার সদর'],
            ['name_en' => 'Kutubdia', 'name_bn' => 'কুতুবদিয়া'],
            ['name_en' => 'Maheshkhali', 'name_bn' => 'মহেশখালী'],
            ['name_en' => 'Ramu', 'name_bn' => 'রামু'],
            ['name_en' => 'Teknaf', 'name_bn' => 'টেকনাফ'],
            ['name_en' => 'Ukhia', 'name_bn' => 'উখিয়া'],
            ['name_en' => 'Pekua', 'name_bn' => 'পেকুয়া'],
        ],
        'Comilla' => [
            ['name_en' => 'Barura', 'name_bn' => 'বরুরা'],
            ['name_en' => 'Brahmanpara', 'name_bn' => 'ব্রাহ্মণপাড়া'],
            ['name_en' => 'Burichang', 'name_bn' => 'বুড়িচং'],
            ['name_en' => 'Chandina', 'name_bn' => 'চান্দিনা'],
            ['name_en' => 'Chauddagram', 'name_bn' => 'চৌদ্দগ্রাম'],
            ['name_en' => 'Daudkandi', 'name_bn' => 'দাউদকান্দি'],
            ['name_en' => 'Debidwar', 'name_bn' => 'দেবিদ্বার'],
            ['name_en' => 'Homna', 'name_bn' => 'হোমনা'],
            ['name_en' => 'Laksam', 'name_bn' => 'লাকসাম'],
            ['name_en' => 'Muradnagar', 'name_bn' => 'মুরাদনগর'],
            ['name_en' => 'Nangalkot', 'name_bn' => 'নাঙ্গলকোট'],
            ['name_en' => 'Comilla Sadar Dakshin', 'name_bn' => 'কুমিল্লা সদর দক্ষিণ'],
            ['name_en' => 'Titas', 'name_bn' => 'তিতাস'],
        ],
        'Rajshahi' => [
            ['name_en' => 'Bagha', 'name_bn' => 'বাঘা'],
            ['name_en' => 'Bagmara', 'name_bn' => 'বাগমারা'],
            ['name_en' => 'Charghat', 'name_bn' => 'চারঘাট'],
            ['name_en' => 'Durgapur', 'name_bn' => 'দুর্গাপুর'],
            ['name_en' => 'Godagari', 'name_bn' => 'গোদাগাড়ী'],
            ['name_en' => 'Mohanpur', 'name_bn' => 'মোহনপুর'],
            ['name_en' => 'Paba', 'name_bn' => 'পবা'],
            ['name_en' => 'Puthia', 'name_bn' => 'পুঠিয়া'],
            ['name_en' => 'Tanore', 'name_bn' => 'তানোর'],
        ],
        'Khulna' => [
            ['name_en' => 'Batiaghata', 'name_bn' => 'বটিয়াঘাটা'],
            ['name_en' => 'Dacope', 'name_bn' => 'দাকোপ'],
            ['name_en' => 'Dumuria', 'name_bn' => 'ডুমুরিয়া'],
            ['name_en' => 'Dighalia', 'name_bn' => 'দিঘলিয়া'],
            ['name_en' => 'Koyra', 'name_bn' => 'কয়রা'],
            ['name_en' => 'Paikgacha', 'name_bn' => 'পাইকগাছা'],
            ['name_en' => 'Phultala', 'name_bn' => 'ফুলতলা'],
            ['name_en' => 'Rupsa', 'name_bn' => 'রূপসা'],
            ['name_en' => 'Terokhada', 'name_bn' => 'তেরখাদা'],
        ],
        'Barisal' => [
            ['name_en' => 'Agailjhara', 'name_bn' => 'আগৈলঝাড়া'],
            ['name_en' => 'Babuganj', 'name_bn' => 'বাবুগঞ্জ'],
            ['name_en' => 'Bakerganj', 'name_bn' => 'বাকেরগঞ্জ'],
            ['name_en' => 'Banaripara', 'name_bn' => 'বানারীপাড়া'],
            ['name_en' => 'Gaurnadi', 'name_bn' => 'গৌরনদী'],
            ['name_en' => 'Hizla', 'name_bn' => 'হিজলা'],
            ['name_en' => 'Mehendiganj', 'name_bn' => 'মেহেন্দিগঞ্জ'],
            ['name_en' => 'Muladi', 'name_bn' => 'মুলাদি'],
            ['name_en' => 'Wazirpur', 'name_bn' => 'ওয়াজিরপুর'],
        ],
        'Sylhet' => [
            ['name_en' => 'Balaganj', 'name_bn' => 'বালাগঞ্জ'],
            ['name_en' => 'Beanibazar', 'name_bn' => 'বিয়ানীবাজার'],
            ['name_en' => 'Bishwanath', 'name_bn' => 'বিশ্বনাথ'],
            ['name_en' => 'Companiganj', 'name_bn' => 'কোম্পানীগঞ্জ'],
            ['name_en' => 'Dakshin Surma', 'name_bn' => 'দক্ষিণ সুরমা'],
            ['name_en' => 'Fenchuganj', 'name_bn' => 'ফেঞ্চুগঞ্জ'],
            ['name_en' => 'Golapganj', 'name_bn' => 'গোলাপগঞ্জ'],
            ['name_en' => 'Gowainghat', 'name_bn' => 'গোয়াইনঘাট'],
            ['name_en' => 'Jaintiapur', 'name_bn' => 'জৈন্তাপুর'],
            ['name_en' => 'Kanaighat', 'name_bn' => 'কানাইঘাট'],
            ['name_en' => 'Sylhet Sadar', 'name_bn' => 'সিলেট সদর'],
            ['name_en' => 'Zakiganj', 'name_bn' => 'জকিগঞ্জ'],
        ],
        'Rangpur' => [
            ['name_en' => 'Badarganj', 'name_bn' => 'বদরগঞ্জ'],
            ['name_en' => 'Gangachara', 'name_bn' => 'গঙ্গাচড়া'],
            ['name_en' => 'Kaunia', 'name_bn' => 'কাউনিয়া'],
            ['name_en' => 'Mithapukur', 'name_bn' => 'মিঠাপুকুর'],
            ['name_en' => 'Pirgachha', 'name_bn' => 'পীরগাছা'],
            ['name_en' => 'Pirganj', 'name_bn' => 'পীরগঞ্জ'],
            ['name_en' => 'Rangpur Sadar', 'name_bn' => 'রংপুর সদর'],
            ['name_en' => 'Taraganj', 'name_bn' => 'তারাগঞ্জ'],
        ],
        'Mymensingh' => [
            ['name_en' => 'Bhaluka', 'name_bn' => 'ভালুকা'],
            ['name_en' => 'Dhobaura', 'name_bn' => 'ধোবাউরা'],
            ['name_en' => 'Fulbaria', 'name_bn' => 'ফুলবাড়ীয়া'],
            ['name_en' => 'Gaffargaon', 'name_bn' => 'গফরগাঁও'],
            ['name_en' => 'Gauripur', 'name_bn' => 'গৌরীপুর'],
            ['name_en' => 'Haluaghat', 'name_bn' => 'হালুয়াঘাট'],
            ['name_en' => 'Ishwarganj', 'name_bn' => 'ঈশ্বরগঞ্জ'],
            ['name_en' => 'Muktagachha', 'name_bn' => 'মুক্তাগাছা'],
            ['name_en' => 'Mymensingh Sadar', 'name_bn' => 'ময়মনসিংহ সদর'],
            ['name_en' => 'Nandail', 'name_bn' => 'নান্দাইল'],
            ['name_en' => 'Phulpur', 'name_bn' => 'ফুলপুর'],
            ['name_en' => 'Trishal', 'name_bn' => 'ত্রিশাল'],
        ],
    ];


    public function run(): void
    {
        // Create Divisions
        $divisions = [];
        foreach ($this->divisionsData as $data) {
            $divisions[] = Division::create($data);
        }

        // Create Districts
        $districts = [];
        foreach ($divisions as $division) {
            $districtsForDivision = $this->districtsData[$division->name_en] ?? [];
            foreach ($districtsForDivision as $data) {
                $districts[] = District::create(array_merge($data, ['division_id' => $division->id]));
            }
        }

        // Create Upazilas
        $upazilas = [];
        foreach ($districts as $district) {
            $upazilasForDistrict = $this->upazilasData[$district->name_en] ?? [];
            foreach ($upazilasForDistrict as $upazilaData) {
                $upazilas[] = Upazila::create([
                    'name_en' => $upazilaData['name_en'],
                    'name_bn' => $upazilaData['name_bn'],
                    'bbs_code' => null,
                    'district_id' => $district->id,
                ]);
            }
        }


        // Create 2 Mouzas per Upazila
        $mouzas = [];
        foreach ($upazilas as $upazila) {
            for ($i = 1; $i <= 2; $i++) {
                $mouzas[] = Mouza::create([
                    'name_en' => "Mouza_{$upazila->name_en}_{$i}",
                    'name_bn' => "মৌজা {$i}",
                    'jl_no' => str_pad($i, 3, '0', STR_PAD_LEFT),
                    'mouza_code' => strtoupper(substr($upazila->name_en, 0, 3)) . "_{$i}",
                    'upazila_id' => $upazila->id,
                ]);
            }
        }

        // Create 2 Zils per Mouza
        $zils = [];
        foreach ($mouzas as $mouza) {
            for ($j = 1; $j <= 2; $j++) {
                $zils[] = Zil::create([
                    'zil_no' => "{$mouza->id}_Z{$j}",
                    'map_url' => null,
                    'meta' => null,
                    'mouza_id' => $mouza->id,
                ]);
            }
        }

        // Create 1 MouzaMap per Zil
        $surveyTypes = [1, 2, 3, 4, 5];
        foreach ($zils as $zil) {
            MouzaMap::create([
                'zil_id' => $zil->id,
                'name' => "Map for Zil {$zil->id}",
                'document' => null,
                'survey_type_id' => $surveyTypes[array_rand($surveyTypes)],
            ]);
        }

        // Create 2 Dags per Zil
        foreach ($zils as $zil) {
            for ($k = 1; $k <= 2; $k++) {
                Dag::create([
                    'dag_no' => "{$zil->id}_D{$k}",
                    'khotiyan' => ['owner' => "Owner_{$zil->id}_{$k}", 'area' => rand(100, 1000) . ' sqft'],
                    'survey_type_id' => $surveyTypes[array_rand($surveyTypes)],
                    'zil_id' => $zil->id,
                ]);
            }
        }
    }
}
