<?php

namespace Database\Seeders;

use App\Models\Dag;
use App\Models\District;
use App\Models\Division;
use App\Models\Mouza;
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
            ['name_en' => 'Dhamrai', 'name_bn' => 'ধামরাই', 'bbs_code' => '01'],
            ['name_en' => 'Dohar', 'name_bn' => 'দোহার', 'bbs_code' => '02'],
            ['name_en' => 'Keraniganj', 'name_bn' => 'কেরানীগঞ্জ', 'bbs_code' => '03'],
            ['name_en' => 'Nawabganj', 'name_bn' => 'নবাবগঞ্জ', 'bbs_code' => '04'],
            ['name_en' => 'Savar', 'name_bn' => 'সাভার', 'bbs_code' => '05'],
        ],
    ];

    private $mouzasData = [
        'Dhamrai' => [
            ['name_en' => 'Mouza1', 'name_bn' => 'মৌজা ১', 'jl_no' => '001', 'mouza_code' => 'D001'],
            ['name_en' => 'Mouza2', 'name_bn' => 'মৌজা ২', 'jl_no' => '002', 'mouza_code' => 'D002'],
        ],
    ];

    private $zilsData = [
        'Mouza1' => [
            ['zil_no' => 'Z001', 'map_url' => null, 'meta' => null],
            ['zil_no' => 'Z002', 'map_url' => null, 'meta' => null],
        ],
    ];

    private $dagsData = [
        'Z001' => [
            ['dag_no' => 'DAG001', 'khotiyan' => ['owner' => 'Owner1', 'area' => '100 sqft']],
            ['dag_no' => 'DAG002', 'khotiyan' => ['owner' => 'Owner2', 'area' => '150 sqft']],
        ],
    ];

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create Divisions
        $divisions = [];
        foreach ($this->divisionsData as $data) {
            $divisions[] = Division::create($data);
        }

        // Create Districts for each Division
        $districts = [];
        foreach ($divisions as $division) {
            $districtsForDivision = $this->districtsData[$division->name_en] ?? [];
            foreach ($districtsForDivision as $data) {
                $districts[] = District::create(array_merge($data, ['division_id' => $division->id]));
            }
        }

        // Create Upazilas for each District
        $upazilas = [];
        foreach ($districts as $district) {
            $upazilasForDistrict = $this->upazilasData[$district->name_en] ?? [];
            foreach ($upazilasForDistrict as $data) {
                $upazilas[] = Upazila::create(array_merge($data, ['district_id' => $district->id]));
            }
        }

        // Create Mouzas for each Upazila
        $mouzas = [];
        foreach ($upazilas as $upazila) {
            $mouzasForUpazila = $this->mouzasData[$upazila->name_en] ?? [];
            foreach ($mouzasForUpazila as $data) {
                $mouzas[] = Mouza::create(array_merge($data, ['upazila_id' => $upazila->id]));
            }
        }

        // Create Zils for each Mouza
        $zils = [];
        foreach ($mouzas as $mouza) {
            $zilsForMouza = $this->zilsData[$mouza->name_en] ?? [];
            foreach ($zilsForMouza as $data) {
                $zils[] = Zil::create(array_merge($data, ['mouza_id' => $mouza->id]));
            }
        }

        // Create Dags for each Zil
        foreach ($zils as $zil) {
            $dagsForZil = $this->dagsData[$zil->zil_no] ?? [];
            foreach ($dagsForZil as $data) {
                Dag::create(array_merge($data, ['zil_id' => $zil->id]));
            }
        }
    }
}
