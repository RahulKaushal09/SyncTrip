import React, { useState, useEffect } from 'react';
// import '../../styles/festivalsEvents.css'; // Optional: Custom CSS for additional styling
// import { BsHeart, BsStarFill } from 'react-icons/bs'; // Add this line
import LocationCard from '../LocationCard/LocationCard';
// import locations from "../../data/locations.json"
import EventList from '../Events/EventsListingBlock';
import Fuse from "fuse.js";
import toast from 'react-hot-toast';


import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import eventsEmptyState from '../../assets/images/eventsEmptyState.jpg'; // Adjust the path based on your project structure

// Empty State Component
const EmptyState = () => (
	<div
		style={{
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
			justifyContent: 'center',
			textAlign: 'center',
			padding: '40px',
			margin: '20px auto',
			maxWidth: '600px',
		}}
	>
		<img
			src={eventsEmptyState}
			alt="No events available"
			style={{ maxWidth: '100%', height: 'auto', marginBottom: '20px' }}
		/>
		<h3>No Events Found</h3>
		<p>
			Please allow location permissions to discover exciting festivals and events near you!
		</p>
		<button
			className="btn btn-black"
			onClick={() => {
				// Optionally, trigger location permission request again
				if (navigator.geolocation) {
					navigator.geolocation.getCurrentPosition(
						() => window.location.reload(),
						() => toast.error('Location permission is required to fetch events.')
					);
				}
			}}
		>
			Allow Location
		</button>
	</div>
);

const indianCitiesPageData = [
	{
		"locationName": "Aalo",
		"locationCode": ""
	},
	{
		"locationName": "Abohar",
		"locationCode": ""
	},
	{
		"locationName": "Abu Road",
		"locationCode": ""
	},
	{
		"locationName": "Achampet",
		"locationCode": ""
	},
	{
		"locationName": "Acharapakkam",
		"locationCode": ""
	},
	{
		"locationName": "Addanki",
		"locationCode": ""
	},
	{
		"locationName": "Adilabad",
		"locationCode": ""
	},
	{
		"locationName": "Adimali",
		"locationCode": ""
	},
	{
		"locationName": "Adipur",
		"locationCode": ""
	},
	{
		"locationName": "Adoni",
		"locationCode": ""
	},
	{
		"locationName": "Agar Malwa",
		"locationCode": ""
	},
	{
		"locationName": "Agartala",
		"locationCode": ""
	},
	{
		"locationName": "Agiripalli",
		"locationCode": ""
	},
	{
		"locationName": "Agra",
		"locationCode": ""
	},
	{
		"locationName": "Ahilyanagar (Ahmednagar)",
		"locationCode": ""
	},
	{
		"locationName": "Ahmedgarh",
		"locationCode": ""
	},
	{
		"locationName": "Ahore",
		"locationCode": ""
	},
	{
		"locationName": "Aizawl",
		"locationCode": ""
	},
	{
		"locationName": "Ajmer",
		"locationCode": ""
	},
	{
		"locationName": "Akaltara",
		"locationCode": ""
	},
	{
		"locationName": "Akbarpur",
		"locationCode": ""
	},
	{
		"locationName": "Akividu",
		"locationCode": ""
	},
	{
		"locationName": "Akluj",
		"locationCode": ""
	},
	{
		"locationName": "Akola",
		"locationCode": ""
	},
	{
		"locationName": "Akot",
		"locationCode": ""
	},
	{
		"locationName": "Alakode",
		"locationCode": ""
	},
	{
		"locationName": "Alangudi",
		"locationCode": ""
	},
	{
		"locationName": "Alangulam",
		"locationCode": ""
	},
	{
		"locationName": "Alappuzha",
		"locationCode": ""
	},
	{
		"locationName": "Alathur",
		"locationCode": ""
	},
	{
		"locationName": "Alibaug",
		"locationCode": ""
	},
	{
		"locationName": "Aligarh",
		"locationCode": ""
	},
	{
		"locationName": "Alipurduar",
		"locationCode": ""
	},
	{
		"locationName": "Almora",
		"locationCode": ""
	},
	{
		"locationName": "Alsisar (Rajasthan)",
		"locationCode": ""
	},
	{
		"locationName": "Alur",
		"locationCode": ""
	},
	{
		"locationName": "Alwar",
		"locationCode": ""
	},
	{
		"locationName": "Amadalavalasa",
		"locationCode": ""
	},
	{
		"locationName": "Amalapuram",
		"locationCode": ""
	},
	{
		"locationName": "Amalner",
		"locationCode": ""
	},
	{
		"locationName": "Amangal",
		"locationCode": ""
	},
	{
		"locationName": "Amanpur",
		"locationCode": ""
	},
	{
		"locationName": "Amaravathi",
		"locationCode": ""
	},
	{
		"locationName": "Ambajogai",
		"locationCode": ""
	},
	{
		"locationName": "Ambala",
		"locationCode": ""
	},
	{
		"locationName": "Ambikapur",
		"locationCode": ""
	},
	{
		"locationName": "Ambur",
		"locationCode": ""
	},
	{
		"locationName": "Amgaon",
		"locationCode": ""
	},
	{
		"locationName": "Amravati",
		"locationCode": ""
	},
	{
		"locationName": "Amreli",
		"locationCode": ""
	},
	{
		"locationName": "Amritsar",
		"locationCode": ""
	},
	{
		"locationName": "Amroha",
		"locationCode": ""
	},
	{
		"locationName": "Anaikatti",
		"locationCode": ""
	},
	{
		"locationName": "Anakapalle",
		"locationCode": ""
	},
	{
		"locationName": "Anand",
		"locationCode": ""
	},
	{
		"locationName": "Anandapur",
		"locationCode": ""
	},
	{
		"locationName": "Anantapalli",
		"locationCode": ""
	},
	{
		"locationName": "Anantapur",
		"locationCode": ""
	},
	{
		"locationName": "Anaparthi",
		"locationCode": ""
	},
	{
		"locationName": "Anchal",
		"locationCode": ""
	},
	{
		"locationName": "Andaman And Nicobar",
		"locationCode": ""
	},
	{
		"locationName": "Anekal",
		"locationCode": ""
	},
	{
		"locationName": "Angadipuram",
		"locationCode": ""
	},
	{
		"locationName": "Angamaly",
		"locationCode": ""
	},
	{
		"locationName": "Angara",
		"locationCode": ""
	},
	{
		"locationName": "Angul",
		"locationCode": ""
	},
	{
		"locationName": "Anjad",
		"locationCode": ""
	},
	{
		"locationName": "Anjar",
		"locationCode": ""
	},
	{
		"locationName": "Anklav",
		"locationCode": ""
	},
	{
		"locationName": "Ankleshwar",
		"locationCode": ""
	},
	{
		"locationName": "Ankola",
		"locationCode": ""
	},
	{
		"locationName": "Annavaram",
		"locationCode": ""
	},
	{
		"locationName": "Annigeri",
		"locationCode": ""
	},
	{
		"locationName": "Anthiyur",
		"locationCode": ""
	},
	{
		"locationName": "Apra",
		"locationCode": ""
	},
	{
		"locationName": "Arakkonam",
		"locationCode": ""
	},
	{
		"locationName": "Arambagh",
		"locationCode": ""
	},
	{
		"locationName": "Arambol",
		"locationCode": ""
	},
	{
		"locationName": "Aranthangi",
		"locationCode": ""
	},
	{
		"locationName": "Aravakurichi",
		"locationCode": ""
	},
	{
		"locationName": "Ariyalur",
		"locationCode": ""
	},
	{
		"locationName": "Arkalgud",
		"locationCode": ""
	},
	{
		"locationName": "Armoor",
		"locationCode": ""
	},
	{
		"locationName": "Arni",
		"locationCode": ""
	},
	{
		"locationName": "Arsikere",
		"locationCode": ""
	},
	{
		"locationName": "Aruppukottai",
		"locationCode": ""
	},
	{
		"locationName": "Asansol",
		"locationCode": ""
	},
	{
		"locationName": "Ashoknagar",
		"locationCode": ""
	},
	{
		"locationName": "Ashoknagar (West Bengal)",
		"locationCode": ""
	},
	{
		"locationName": "Ashta",
		"locationCode": ""
	},
	{
		"locationName": "Ashta (Maharashtra)",
		"locationCode": ""
	},
	{
		"locationName": "Asika",
		"locationCode": ""
	},
	{
		"locationName": "Aswaraopeta",
		"locationCode": ""
	},
	{
		"locationName": "Athagarh",
		"locationCode": ""
	},
	{
		"locationName": "Athani",
		"locationCode": ""
	},
	{
		"locationName": "Atmakur (Nellore)",
		"locationCode": ""
	},
	{
		"locationName": "Atpadi",
		"locationCode": ""
	},
	{
		"locationName": "Atraulia",
		"locationCode": ""
	},
	{
		"locationName": "Attibele",
		"locationCode": ""
	},
	{
		"locationName": "Attili",
		"locationCode": ""
	},
	{
		"locationName": "Attingal",
		"locationCode": ""
	},
	{
		"locationName": "Attur",
		"locationCode": ""
	},
	{
		"locationName": "Aurangabad (Bihar)",
		"locationCode": ""
	},
	{
		"locationName": "Aurangabad (West Bengal)",
		"locationCode": ""
	},
	{
		"locationName": "Auroville",
		"locationCode": ""
	},
	{
		"locationName": "Aushapur",
		"locationCode": ""
	},
	{
		"locationName": "Avinashi",
		"locationCode": ""
	},
	{
		"locationName": "Ayodhya",
		"locationCode": ""
	},
	{
		"locationName": "Azamgarh",
		"locationCode": ""
	},
	{
		"locationName": "B. Kothakota",
		"locationCode": ""
	},
	{
		"locationName": "Babra",
		"locationCode": ""
	},
	{
		"locationName": "Badami",
		"locationCode": ""
	},
	{
		"locationName": "Badaun",
		"locationCode": ""
	},
	{
		"locationName": "Baddi",
		"locationCode": ""
	},
	{
		"locationName": "Badhra",
		"locationCode": ""
	},
	{
		"locationName": "Badnagar",
		"locationCode": ""
	},
	{
		"locationName": "Badnawar",
		"locationCode": ""
	},
	{
		"locationName": "Badvel",
		"locationCode": ""
	},
	{
		"locationName": "Bagaha",
		"locationCode": ""
	},
	{
		"locationName": "Bagalkot",
		"locationCode": ""
	},
	{
		"locationName": "Bagbahara",
		"locationCode": ""
	},
	{
		"locationName": "Bagepalli",
		"locationCode": ""
	},
	{
		"locationName": "Bagha Purana",
		"locationCode": ""
	},
	{
		"locationName": "Baghmari",
		"locationCode": ""
	},
	{
		"locationName": "Bagnan",
		"locationCode": ""
	},
	{
		"locationName": "Bagru",
		"locationCode": ""
	},
	{
		"locationName": "Bahadurgarh",
		"locationCode": ""
	},
	{
		"locationName": "Bahraich",
		"locationCode": ""
	},
	{
		"locationName": "Baidyabati",
		"locationCode": ""
	},
	{
		"locationName": "Baihar",
		"locationCode": ""
	},
	{
		"locationName": "Baijnath",
		"locationCode": ""
	},
	{
		"locationName": "Baikunthpur",
		"locationCode": ""
	},
	{
		"locationName": "Baindur",
		"locationCode": ""
	},
	{
		"locationName": "Bakhrahat",
		"locationCode": ""
	},
	{
		"locationName": "Balaghat",
		"locationCode": ""
	},
	{
		"locationName": "Balangir",
		"locationCode": ""
	},
	{
		"locationName": "Balasore",
		"locationCode": ""
	},
	{
		"locationName": "Balijipeta",
		"locationCode": ""
	},
	{
		"locationName": "Ballia",
		"locationCode": ""
	},
	{
		"locationName": "Balod",
		"locationCode": ""
	},
	{
		"locationName": "Baloda Bazar",
		"locationCode": ""
	},
	{
		"locationName": "Balotra",
		"locationCode": ""
	},
	{
		"locationName": "Balrampur",
		"locationCode": ""
	},
	{
		"locationName": "Balurghat",
		"locationCode": ""
	},
	{
		"locationName": "Banaganapalli",
		"locationCode": ""
	},
	{
		"locationName": "Banahatti",
		"locationCode": ""
	},
	{
		"locationName": "Banaskantha",
		"locationCode": ""
	},
	{
		"locationName": "Banga",
		"locationCode": ""
	},
	{
		"locationName": "Bangaon",
		"locationCode": ""
	},
	{
		"locationName": "Bangarpet",
		"locationCode": ""
	},
	{
		"locationName": "Bangarupalem",
		"locationCode": ""
	},
	{
		"locationName": "Banki",
		"locationCode": ""
	},
	{
		"locationName": "Bankura",
		"locationCode": ""
	},
	{
		"locationName": "Banswada",
		"locationCode": ""
	},
	{
		"locationName": "Banswara",
		"locationCode": ""
	},
	{
		"locationName": "Bantumilli",
		"locationCode": ""
	},
	{
		"locationName": "Bapatla",
		"locationCode": ""
	},
	{
		"locationName": "Barabanki",
		"locationCode": ""
	},
	{
		"locationName": "Baramati",
		"locationCode": ""
	},
	{
		"locationName": "Baramulla",
		"locationCode": ""
	},
	{
		"locationName": "Baran",
		"locationCode": ""
	},
	{
		"locationName": "Barasat",
		"locationCode": ""
	},
	{
		"locationName": "Baraut",
		"locationCode": ""
	},
	{
		"locationName": "Barbil",
		"locationCode": ""
	},
	{
		"locationName": "Bardoli",
		"locationCode": ""
	},
	{
		"locationName": "Bareilly",
		"locationCode": ""
	},
	{
		"locationName": "Bareja",
		"locationCode": ""
	},
	{
		"locationName": "Bargarh",
		"locationCode": ""
	},
	{
		"locationName": "Barharwa",
		"locationCode": ""
	},
	{
		"locationName": "Barhi",
		"locationCode": ""
	},
	{
		"locationName": "Baripada",
		"locationCode": ""
	},
	{
		"locationName": "Barmer",
		"locationCode": ""
	},
	{
		"locationName": "Barnala",
		"locationCode": ""
	},
	{
		"locationName": "Barpeta Road",
		"locationCode": ""
	},
	{
		"locationName": "Barrackpore",
		"locationCode": ""
	},
	{
		"locationName": "Barshi",
		"locationCode": ""
	},
	{
		"locationName": "Baruipur",
		"locationCode": ""
	},
	{
		"locationName": "Barwadih",
		"locationCode": ""
	},
	{
		"locationName": "Barwaha",
		"locationCode": ""
	},
	{
		"locationName": "Barwani",
		"locationCode": ""
	},
	{
		"locationName": "Basantpur",
		"locationCode": ""
	},
	{
		"locationName": "Basirhat",
		"locationCode": ""
	},
	{
		"locationName": "Basna",
		"locationCode": ""
	},
	{
		"locationName": "Basti",
		"locationCode": ""
	},
	{
		"locationName": "Bathinda",
		"locationCode": ""
	},
	{
		"locationName": "Batlagundu",
		"locationCode": ""
	},
	{
		"locationName": "Bavla",
		"locationCode": ""
	},
	{
		"locationName": "Bayad",
		"locationCode": ""
	},
	{
		"locationName": "Bayana",
		"locationCode": ""
	},
	{
		"locationName": "Bazpur",
		"locationCode": ""
	},
	{
		"locationName": "Beawar",
		"locationCode": ""
	},
	{
		"locationName": "Beed",
		"locationCode": ""
	},
	{
		"locationName": "Beguniapada",
		"locationCode": ""
	},
	{
		"locationName": "Begusarai",
		"locationCode": ""
	},
	{
		"locationName": "Behror",
		"locationCode": ""
	},
	{
		"locationName": "Belagavi (Belgaum)",
		"locationCode": ""
	},
	{
		"locationName": "Belakavadi",
		"locationCode": ""
	},
	{
		"locationName": "Belghoria",
		"locationCode": ""
	},
	{
		"locationName": "Bellampalli",
		"locationCode": ""
	},
	{
		"locationName": "Bellary",
		"locationCode": ""
	},
	{
		"locationName": "Belur",
		"locationCode": ""
	},
	{
		"locationName": "Bemetara",
		"locationCode": ""
	},
	{
		"locationName": "Berachampa",
		"locationCode": ""
	},
	{
		"locationName": "Berhampore (W.B.)",
		"locationCode": ""
	},
	{
		"locationName": "Berhampur (Odisha)",
		"locationCode": ""
	},
	{
		"locationName": "Bestavaripeta",
		"locationCode": ""
	},
	{
		"locationName": "Betalbatim",
		"locationCode": ""
	},
	{
		"locationName": "Betberia",
		"locationCode": ""
	},
	{
		"locationName": "Bethamcherla",
		"locationCode": ""
	},
	{
		"locationName": "Bettiah",
		"locationCode": ""
	},
	{
		"locationName": "Betul",
		"locationCode": ""
	},
	{
		"locationName": "Bhadrachalam",
		"locationCode": ""
	},
	{
		"locationName": "Bhadrak",
		"locationCode": ""
	},
	{
		"locationName": "Bhadravati",
		"locationCode": ""
	},
	{
		"locationName": "Bhagalpur",
		"locationCode": ""
	},
	{
		"locationName": "Bhainsa",
		"locationCode": ""
	},
	{
		"locationName": "Bhandara",
		"locationCode": ""
	},
	{
		"locationName": "Bharamasagara",
		"locationCode": ""
	},
	{
		"locationName": "Bharatpur",
		"locationCode": ""
	},
	{
		"locationName": "Bharuch",
		"locationCode": ""
	},
	{
		"locationName": "Bhatapara",
		"locationCode": ""
	},
	{
		"locationName": "Bhatgaon",
		"locationCode": ""
	},
	{
		"locationName": "Bhatkal",
		"locationCode": ""
	},
	{
		"locationName": "Bhattiprolu",
		"locationCode": ""
	},
	{
		"locationName": "Bhavani",
		"locationCode": ""
	},
	{
		"locationName": "Bhavnagar",
		"locationCode": ""
	},
	{
		"locationName": "Bhawanipatna",
		"locationCode": ""
	},
	{
		"locationName": "Bheemgal",
		"locationCode": ""
	},
	{
		"locationName": "Bhilai",
		"locationCode": ""
	},
	{
		"locationName": "Bhilwara",
		"locationCode": ""
	},
	{
		"locationName": "Bhimadole",
		"locationCode": ""
	},
	{
		"locationName": "Bhimavaram",
		"locationCode": ""
	},
	{
		"locationName": "Bhind",
		"locationCode": ""
	},
	{
		"locationName": "Bhiwadi",
		"locationCode": ""
	},
	{
		"locationName": "Bhiwani",
		"locationCode": ""
	},
	{
		"locationName": "Bhogapuram",
		"locationCode": ""
	},
	{
		"locationName": "Bhongir",
		"locationCode": ""
	},
	{
		"locationName": "Bhopal",
		"locationCode": ""
	},
	{
		"locationName": "Bhubaneswar",
		"locationCode": ""
	},
	{
		"locationName": "Bhuj",
		"locationCode": ""
	},
	{
		"locationName": "Bhuntar",
		"locationCode": ""
	},
	{
		"locationName": "Bhupalpalle",
		"locationCode": ""
	},
	{
		"locationName": "Bhusawal",
		"locationCode": ""
	},
	{
		"locationName": "Bhutan",
		"locationCode": ""
	},
	{
		"locationName": "Bhuvanagiri",
		"locationCode": ""
	},
	{
		"locationName": "Biaora",
		"locationCode": ""
	},
	{
		"locationName": "Bibinagar",
		"locationCode": ""
	},
	{
		"locationName": "Bichkunda",
		"locationCode": ""
	},
	{
		"locationName": "Bidadi",
		"locationCode": ""
	},
	{
		"locationName": "Bidar",
		"locationCode": ""
	},
	{
		"locationName": "Bihar Sharif",
		"locationCode": ""
	},
	{
		"locationName": "Bihpuria",
		"locationCode": ""
	},
	{
		"locationName": "Bijainagar",
		"locationCode": ""
	},
	{
		"locationName": "Bijnor",
		"locationCode": ""
	},
	{
		"locationName": "Bijoynagar",
		"locationCode": ""
	},
	{
		"locationName": "Bikaner",
		"locationCode": ""
	},
	{
		"locationName": "Bikramganj",
		"locationCode": ""
	},
	{
		"locationName": "Bilara",
		"locationCode": ""
	},
	{
		"locationName": "Bilaspur",
		"locationCode": ""
	},
	{
		"locationName": "Bilaspur (Himachal Pradesh)",
		"locationCode": ""
	},
	{
		"locationName": "Bilgi",
		"locationCode": ""
	},
	{
		"locationName": "Bilimora",
		"locationCode": ""
	},
	{
		"locationName": "Billawar",
		"locationCode": ""
	},
	{
		"locationName": "Biraul",
		"locationCode": ""
	},
	{
		"locationName": "Birra",
		"locationCode": ""
	},
	{
		"locationName": "Bishnupur",
		"locationCode": ""
	},
	{
		"locationName": "Bishrampur",
		"locationCode": ""
	},
	{
		"locationName": "Biswanath Chariali",
		"locationCode": ""
	},
	{
		"locationName": "Bobbili",
		"locationCode": ""
	},
	{
		"locationName": "Bodhan",
		"locationCode": ""
	},
	{
		"locationName": "Bodinayakanur",
		"locationCode": ""
	},
	{
		"locationName": "Boisar",
		"locationCode": ""
	},
	{
		"locationName": "Bokaro",
		"locationCode": ""
	},
	{
		"locationName": "Bolpur",
		"locationCode": ""
	},
	{
		"locationName": "Bomdila",
		"locationCode": ""
	},
	{
		"locationName": "Bommidi",
		"locationCode": ""
	},
	{
		"locationName": "Bonakal",
		"locationCode": ""
	},
	{
		"locationName": "Bongaigaon",
		"locationCode": ""
	},
	{
		"locationName": "Bongaon",
		"locationCode": ""
	},
	{
		"locationName": "Borsad",
		"locationCode": ""
	},
	{
		"locationName": "Botad",
		"locationCode": ""
	},
	{
		"locationName": "Brahmapur",
		"locationCode": ""
	},
	{
		"locationName": "Brahmapuri",
		"locationCode": ""
	},
	{
		"locationName": "Brajrajnagar",
		"locationCode": ""
	},
	{
		"locationName": "Buchireddypalem",
		"locationCode": ""
	},
	{
		"locationName": "Budhlada",
		"locationCode": ""
	},
	{
		"locationName": "Buhari",
		"locationCode": ""
	},
	{
		"locationName": "Bulandshahr",
		"locationCode": ""
	},
	{
		"locationName": "Buldana",
		"locationCode": ""
	},
	{
		"locationName": "Bundu",
		"locationCode": ""
	},
	{
		"locationName": "Burdwan",
		"locationCode": ""
	},
	{
		"locationName": "Burhanpur",
		"locationCode": ""
	},
	{
		"locationName": "Burhar",
		"locationCode": ""
	},
	{
		"locationName": "Buttayagudem",
		"locationCode": ""
	},
	{
		"locationName": "Byadagi",
		"locationCode": ""
	},
	{
		"locationName": "Byadgi",
		"locationCode": ""
	},
	{
		"locationName": "Byasanagar",
		"locationCode": ""
	},
	{
		"locationName": "Calicut",
		"locationCode": ""
	},
	{
		"locationName": "Canning",
		"locationCode": ""
	},
	{
		"locationName": "Chagallu",
		"locationCode": ""
	},
	{
		"locationName": "Chakan",
		"locationCode": ""
	},
	{
		"locationName": "Chalakudy",
		"locationCode": ""
	},
	{
		"locationName": "Chalisgaon",
		"locationCode": ""
	},
	{
		"locationName": "Challakere",
		"locationCode": ""
	},
	{
		"locationName": "Challapalli",
		"locationCode": ""
	},
	{
		"locationName": "Chamarajnagar",
		"locationCode": ""
	},
	{
		"locationName": "Chamba",
		"locationCode": ""
	},
	{
		"locationName": "Chamoli",
		"locationCode": ""
	},
	{
		"locationName": "Champa",
		"locationCode": ""
	},
	{
		"locationName": "Champahati",
		"locationCode": ""
	},
	{
		"locationName": "Chanchal",
		"locationCode": ""
	},
	{
		"locationName": "Chandannagar",
		"locationCode": ""
	},
	{
		"locationName": "Chandausi",
		"locationCode": ""
	},
	{
		"locationName": "Chandbali",
		"locationCode": ""
	},
	{
		"locationName": "Chandpur Siau",
		"locationCode": ""
	},
	{
		"locationName": "Chandrakona",
		"locationCode": ""
	},
	{
		"locationName": "Chandrapur",
		"locationCode": ""
	},
	{
		"locationName": "Chandur",
		"locationCode": ""
	},
	{
		"locationName": "Changanassery",
		"locationCode": ""
	},
	{
		"locationName": "Changaramkulam",
		"locationCode": ""
	},
	{
		"locationName": "Channagiri",
		"locationCode": ""
	},
	{
		"locationName": "Channapatna",
		"locationCode": ""
	},
	{
		"locationName": "Channarayapatna",
		"locationCode": ""
	},
	{
		"locationName": "Chanpatia",
		"locationCode": ""
	},
	{
		"locationName": "Chapra",
		"locationCode": ""
	},
	{
		"locationName": "Charkhi Dadri",
		"locationCode": ""
	},
	{
		"locationName": "Chaygaon",
		"locationCode": ""
	},
	{
		"locationName": "Cheeka",
		"locationCode": ""
	},
	{
		"locationName": "Cheepurupalli",
		"locationCode": ""
	},
	{
		"locationName": "Chelpur",
		"locationCode": ""
	},
	{
		"locationName": "Chendrapinni",
		"locationCode": ""
	},
	{
		"locationName": "Chengalpattu",
		"locationCode": ""
	},
	{
		"locationName": "Chengannur",
		"locationCode": ""
	},
	{
		"locationName": "Chennur",
		"locationCode": ""
	},
	{
		"locationName": "Chenthrapini",
		"locationCode": ""
	},
	{
		"locationName": "Cherial",
		"locationCode": ""
	},
	{
		"locationName": "Cherla",
		"locationCode": ""
	},
	{
		"locationName": "Cherpulassery",
		"locationCode": ""
	},
	{
		"locationName": "Cherrapunji",
		"locationCode": ""
	},
	{
		"locationName": "Cherthala",
		"locationCode": ""
	},
	{
		"locationName": "Chetpet",
		"locationCode": ""
	},
	{
		"locationName": "Chevella",
		"locationCode": ""
	},
	{
		"locationName": "Cheyyar",
		"locationCode": ""
	},
	{
		"locationName": "Cheyyur",
		"locationCode": ""
	},
	{
		"locationName": "Chhabra",
		"locationCode": ""
	},
	{
		"locationName": "Chhatarpur",
		"locationCode": ""
	},
	{
		"locationName": "Chhatrapati Sambhajinagar (Aurangabad)",
		"locationCode": ""
	},
	{
		"locationName": "Chhibramau",
		"locationCode": ""
	},
	{
		"locationName": "Chhindwara",
		"locationCode": ""
	},
	{
		"locationName": "Chickmagaluru",
		"locationCode": ""
	},
	{
		"locationName": "Chidambaram",
		"locationCode": ""
	},
	{
		"locationName": "Chikhli",
		"locationCode": ""
	},
	{
		"locationName": "Chikkaballapur",
		"locationCode": ""
	},
	{
		"locationName": "Chikmagalur",
		"locationCode": ""
	},
	{
		"locationName": "Chikodi",
		"locationCode": ""
	},
	{
		"locationName": "Chilakaluripet",
		"locationCode": ""
	},
	{
		"locationName": "Chinnalapatti",
		"locationCode": ""
	},
	{
		"locationName": "Chinnamandem",
		"locationCode": ""
	},
	{
		"locationName": "Chinnamanur",
		"locationCode": ""
	},
	{
		"locationName": "Chinsurah",
		"locationCode": ""
	},
	{
		"locationName": "Chintalapudi",
		"locationCode": ""
	},
	{
		"locationName": "Chintamani",
		"locationCode": ""
	},
	{
		"locationName": "Chinturu",
		"locationCode": ""
	},
	{
		"locationName": "Chiplun",
		"locationCode": ""
	},
	{
		"locationName": "Chiraiyakot",
		"locationCode": ""
	},
	{
		"locationName": "Chirala",
		"locationCode": ""
	},
	{
		"locationName": "Chirawa",
		"locationCode": ""
	},
	{
		"locationName": "Chitradurga",
		"locationCode": ""
	},
	{
		"locationName": "Chittoor",
		"locationCode": ""
	},
	{
		"locationName": "Chittorgarh",
		"locationCode": ""
	},
	{
		"locationName": "Chodavaram",
		"locationCode": ""
	},
	{
		"locationName": "Chon Buri",
		"locationCode": ""
	},
	{
		"locationName": "Chotila",
		"locationCode": ""
	},
	{
		"locationName": "Choutuppal",
		"locationCode": ""
	},
	{
		"locationName": "Churachandpur",
		"locationCode": ""
	},
	{
		"locationName": "Churu",
		"locationCode": ""
	},
	{
		"locationName": "Coimbatore",
		"locationCode": ""
	},
	{
		"locationName": "Colombo",
		"locationCode": ""
	},
	{
		"locationName": "Cooch Behar",
		"locationCode": ""
	},
	{
		"locationName": "Coonoor",
		"locationCode": ""
	},
	{
		"locationName": "Cuddalore",
		"locationCode": ""
	},
	{
		"locationName": "Cumbum",
		"locationCode": ""
	},
	{
		"locationName": "Cumbum (AP)",
		"locationCode": ""
	},
	{
		"locationName": "Cuttack",
		"locationCode": ""
	},
	{
		"locationName": "Dabra",
		"locationCode": ""
	},
	{
		"locationName": "Dahanu",
		"locationCode": ""
	},
	{
		"locationName": "Dahegam",
		"locationCode": ""
	},
	{
		"locationName": "Dahod",
		"locationCode": ""
	},
	{
		"locationName": "Dakshin Barasat",
		"locationCode": ""
	},
	{
		"locationName": "Dalli Rajhara",
		"locationCode": ""
	},
	{
		"locationName": "Dalmianagar",
		"locationCode": ""
	},
	{
		"locationName": "Daman",
		"locationCode": ""
	},
	{
		"locationName": "Damarcherla",
		"locationCode": ""
	},
	{
		"locationName": "Dammapeta",
		"locationCode": ""
	},
	{
		"locationName": "Damoh",
		"locationCode": ""
	},
	{
		"locationName": "Danapur",
		"locationCode": ""
	},
	{
		"locationName": "Dandeli",
		"locationCode": ""
	},
	{
		"locationName": "Dang",
		"locationCode": ""
	},
	{
		"locationName": "Dankaur",
		"locationCode": ""
	},
	{
		"locationName": "Dantewada",
		"locationCode": ""
	},
	{
		"locationName": "Daporijo",
		"locationCode": ""
	},
	{
		"locationName": "Darbhanga",
		"locationCode": ""
	},
	{
		"locationName": "Darjeeling",
		"locationCode": ""
	},
	{
		"locationName": "Darlapudi",
		"locationCode": ""
	},
	{
		"locationName": "Darsi",
		"locationCode": ""
	},
	{
		"locationName": "Darwha",
		"locationCode": ""
	},
	{
		"locationName": "Dasuya",
		"locationCode": ""
	},
	{
		"locationName": "Datia",
		"locationCode": ""
	},
	{
		"locationName": "Daund",
		"locationCode": ""
	},
	{
		"locationName": "Dausa",
		"locationCode": ""
	},
	{
		"locationName": "Davanagere",
		"locationCode": ""
	},
	{
		"locationName": "Davuluru",
		"locationCode": ""
	},
	{
		"locationName": "Deesa",
		"locationCode": ""
	},
	{
		"locationName": "Dehradun",
		"locationCode": ""
	},
	{
		"locationName": "Deogadh",
		"locationCode": ""
	},
	{
		"locationName": "Deoghar",
		"locationCode": ""
	},
	{
		"locationName": "Deoli",
		"locationCode": ""
	},
	{
		"locationName": "Deoli (Rajasthan)",
		"locationCode": ""
	},
	{
		"locationName": "Deoli(Rajasthan)",
		"locationCode": ""
	},
	{
		"locationName": "Deoria",
		"locationCode": ""
	},
	{
		"locationName": "Deralakatte",
		"locationCode": ""
	},
	{
		"locationName": "Devadurga",
		"locationCode": ""
	},
	{
		"locationName": "Devakottai",
		"locationCode": ""
	},
	{
		"locationName": "Devarakadra",
		"locationCode": ""
	},
	{
		"locationName": "Devarakonda",
		"locationCode": ""
	},
	{
		"locationName": "Devarapalle",
		"locationCode": ""
	},
	{
		"locationName": "Devarapalli",
		"locationCode": ""
	},
	{
		"locationName": "Devgad",
		"locationCode": ""
	},
	{
		"locationName": "Dewas",
		"locationCode": ""
	},
	{
		"locationName": "Dhamnod",
		"locationCode": ""
	},
	{
		"locationName": "Dhampur",
		"locationCode": ""
	},
	{
		"locationName": "Dhamtari",
		"locationCode": ""
	},
	{
		"locationName": "Dhanaura",
		"locationCode": ""
	},
	{
		"locationName": "Dhanbad",
		"locationCode": ""
	},
	{
		"locationName": "Dhanera",
		"locationCode": ""
	},
	{
		"locationName": "Dhar",
		"locationCode": ""
	},
	{
		"locationName": "Dharamjaigarh",
		"locationCode": ""
	},
	{
		"locationName": "Dharampur",
		"locationCode": ""
	},
	{
		"locationName": "Dharamsala",
		"locationCode": ""
	},
	{
		"locationName": "Dharamshala",
		"locationCode": ""
	},
	{
		"locationName": "Dharapuram",
		"locationCode": ""
	},
	{
		"locationName": "Dharashiv (Osmanabad)",
		"locationCode": ""
	},
	{
		"locationName": "Dharmanagar",
		"locationCode": ""
	},
	{
		"locationName": "Dharmapuri",
		"locationCode": ""
	},
	{
		"locationName": "Dharmavaram",
		"locationCode": ""
	},
	{
		"locationName": "Dharpally",
		"locationCode": ""
	},
	{
		"locationName": "Dharpur",
		"locationCode": ""
	},
	{
		"locationName": "Dharuhera",
		"locationCode": ""
	},
	{
		"locationName": "Dharwad",
		"locationCode": ""
	},
	{
		"locationName": "Dhaulana",
		"locationCode": ""
	},
	{
		"locationName": "Dhekiajuli",
		"locationCode": ""
	},
	{
		"locationName": "Dhemaji",
		"locationCode": ""
	},
	{
		"locationName": "Dhenkanal",
		"locationCode": ""
	},
	{
		"locationName": "Dholka",
		"locationCode": ""
	},
	{
		"locationName": "Dholpur",
		"locationCode": ""
	},
	{
		"locationName": "Dhone",
		"locationCode": ""
	},
	{
		"locationName": "Dhoraji",
		"locationCode": ""
	},
	{
		"locationName": "Dhrangadhra",
		"locationCode": ""
	},
	{
		"locationName": "Dhubri",
		"locationCode": ""
	},
	{
		"locationName": "Dhule",
		"locationCode": ""
	},
	{
		"locationName": "Dhulian",
		"locationCode": ""
	},
	{
		"locationName": "Dhuliyan",
		"locationCode": ""
	},
	{
		"locationName": "Dhuri",
		"locationCode": ""
	},
	{
		"locationName": "Diamond Harbour",
		"locationCode": ""
	},
	{
		"locationName": "Dibrugarh",
		"locationCode": ""
	},
	{
		"locationName": "Digras",
		"locationCode": ""
	},
	{
		"locationName": "Dildar Nagar",
		"locationCode": ""
	},
	{
		"locationName": "Dima Hasao",
		"locationCode": ""
	},
	{
		"locationName": "Dimapur",
		"locationCode": ""
	},
	{
		"locationName": "Dinanagar",
		"locationCode": ""
	},
	{
		"locationName": "Dindigul",
		"locationCode": ""
	},
	{
		"locationName": "Diphu",
		"locationCode": ""
	},
	{
		"locationName": "Dirang",
		"locationCode": ""
	},
	{
		"locationName": "Doddaballapura",
		"locationCode": ""
	},
	{
		"locationName": "Doimukh",
		"locationCode": ""
	},
	{
		"locationName": "Domkal",
		"locationCode": ""
	},
	{
		"locationName": "Dongargarh",
		"locationCode": ""
	},
	{
		"locationName": "Doolahat Bazar",
		"locationCode": ""
	},
	{
		"locationName": "Doraha",
		"locationCode": ""
	},
	{
		"locationName": "Dornakal",
		"locationCode": ""
	},
	{
		"locationName": "Dowlaiswaram",
		"locationCode": ""
	},
	{
		"locationName": "Draksharamam",
		"locationCode": ""
	},
	{
		"locationName": "Dubbaka",
		"locationCode": ""
	},
	{
		"locationName": "Dubrajpur",
		"locationCode": ""
	},
	{
		"locationName": "Dudhi",
		"locationCode": ""
	},
	{
		"locationName": "Dumka",
		"locationCode": ""
	},
	{
		"locationName": "Dungarpur",
		"locationCode": ""
	},
	{
		"locationName": "Durg",
		"locationCode": ""
	},
	{
		"locationName": "Durgapur",
		"locationCode": ""
	},
	{
		"locationName": "Dwarka",
		"locationCode": ""
	},
	{
		"locationName": "East Godavari",
		"locationCode": ""
	},
	{
		"locationName": "Edappal",
		"locationCode": ""
	},
	{
		"locationName": "Edlapadu",
		"locationCode": ""
	},
	{
		"locationName": "Ekma",
		"locationCode": ""
	},
	{
		"locationName": "Elesvaram",
		"locationCode": ""
	},
	{
		"locationName": "Eluru",
		"locationCode": ""
	},
	{
		"locationName": "Enkoor",
		"locationCode": ""
	},
	{
		"locationName": "Eramalloor",
		"locationCode": ""
	},
	{
		"locationName": "Erandol",
		"locationCode": ""
	},
	{
		"locationName": "Erattupetta",
		"locationCode": ""
	},
	{
		"locationName": "Ernakulam",
		"locationCode": ""
	},
	{
		"locationName": "Erode",
		"locationCode": ""
	},
	{
		"locationName": "Etah",
		"locationCode": ""
	},
	{
		"locationName": "Etawah",
		"locationCode": ""
	},
	{
		"locationName": "Ettumanoor",
		"locationCode": ""
	},
	{
		"locationName": "Eturnagaram",
		"locationCode": ""
	},
	{
		"locationName": "Faizabad",
		"locationCode": ""
	},
	{
		"locationName": "Falakata",
		"locationCode": ""
	},
	{
		"locationName": "Falna",
		"locationCode": ""
	},
	{
		"locationName": "Faridkot",
		"locationCode": ""
	},
	{
		"locationName": "Farrukhabad",
		"locationCode": ""
	},
	{
		"locationName": "Fatehabad",
		"locationCode": ""
	},
	{
		"locationName": "Fatehgarh Sahib",
		"locationCode": ""
	},
	{
		"locationName": "Fatehpur",
		"locationCode": ""
	},
	{
		"locationName": "Fatehpur(Rajasthan)",
		"locationCode": ""
	},
	{
		"locationName": "Fazilka",
		"locationCode": ""
	},
	{
		"locationName": "Firozabad",
		"locationCode": ""
	},
	{
		"locationName": "Firozpur",
		"locationCode": ""
	},
	{
		"locationName": "Forbesganj",
		"locationCode": ""
	},
	{
		"locationName": "France",
		"locationCode": ""
	},
	{
		"locationName": "Fulkusma",
		"locationCode": ""
	},
	{
		"locationName": "G.Mamidada",
		"locationCode": ""
	},
	{
		"locationName": "Gadag",
		"locationCode": ""
	},
	{
		"locationName": "Gadarwara",
		"locationCode": ""
	},
	{
		"locationName": "Gadchiroli",
		"locationCode": ""
	},
	{
		"locationName": "Gadwal",
		"locationCode": ""
	},
	{
		"locationName": "Gajapathinagaram",
		"locationCode": ""
	},
	{
		"locationName": "Gajendragarh",
		"locationCode": ""
	},
	{
		"locationName": "Gajwel",
		"locationCode": ""
	},
	{
		"locationName": "Gampalagudem",
		"locationCode": ""
	},
	{
		"locationName": "Ganapavaram",
		"locationCode": ""
	},
	{
		"locationName": "Gandhidham",
		"locationCode": ""
	},
	{
		"locationName": "Gandhinagar",
		"locationCode": ""
	},
	{
		"locationName": "Gangarampur",
		"locationCode": ""
	},
	{
		"locationName": "Gangavati",
		"locationCode": ""
	},
	{
		"locationName": "Gangoh",
		"locationCode": ""
	},
	{
		"locationName": "Gangtok",
		"locationCode": ""
	},
	{
		"locationName": "Ganjam",
		"locationCode": ""
	},
	{
		"locationName": "Ganjbasoda",
		"locationCode": ""
	},
	{
		"locationName": "Gannavaram",
		"locationCode": ""
	},
	{
		"locationName": "Garhwal",
		"locationCode": ""
	},
	{
		"locationName": "Garla",
		"locationCode": ""
	},
	{
		"locationName": "Gauribidanur",
		"locationCode": ""
	},
	{
		"locationName": "Gauriganj",
		"locationCode": ""
	},
	{
		"locationName": "Gaya",
		"locationCode": ""
	},
	{
		"locationName": "Gazole",
		"locationCode": ""
	},
	{
		"locationName": "Georai",
		"locationCode": ""
	},
	{
		"locationName": "Ghatanji",
		"locationCode": ""
	},
	{
		"locationName": "Ghazipur",
		"locationCode": ""
	},
	{
		"locationName": "Ghorasahan",
		"locationCode": ""
	},
	{
		"locationName": "Ghumarwin",
		"locationCode": ""
	},
	{
		"locationName": "Giddalur",
		"locationCode": ""
	},
	{
		"locationName": "Gingee",
		"locationCode": ""
	},
	{
		"locationName": "Giridih",
		"locationCode": ""
	},
	{
		"locationName": "Goa",
		"locationCode": ""
	},
	{
		"locationName": "Goalpara",
		"locationCode": ""
	},
	{
		"locationName": "Gobichettipalayam",
		"locationCode": ""
	},
	{
		"locationName": "Godavarikhani",
		"locationCode": ""
	},
	{
		"locationName": "Godda",
		"locationCode": ""
	},
	{
		"locationName": "Godhra",
		"locationCode": ""
	},
	{
		"locationName": "Gogawa",
		"locationCode": ""
	},
	{
		"locationName": "Gohana",
		"locationCode": ""
	},
	{
		"locationName": "Gokak",
		"locationCode": ""
	},
	{
		"locationName": "Gokarna",
		"locationCode": ""
	},
	{
		"locationName": "Gokavaram",
		"locationCode": ""
	},
	{
		"locationName": "Gola Bazar",
		"locationCode": ""
	},
	{
		"locationName": "Golaghat",
		"locationCode": ""
	},
	{
		"locationName": "Gollaprolu",
		"locationCode": ""
	},
	{
		"locationName": "Gonda",
		"locationCode": ""
	},
	{
		"locationName": "Gondal",
		"locationCode": ""
	},
	{
		"locationName": "Gondia",
		"locationCode": ""
	},
	{
		"locationName": "Goolikkadavu",
		"locationCode": ""
	},
	{
		"locationName": "Gooty",
		"locationCode": ""
	},
	{
		"locationName": "Gopalganj",
		"locationCode": ""
	},
	{
		"locationName": "Gopalpet",
		"locationCode": ""
	},
	{
		"locationName": "Gopiganj",
		"locationCode": ""
	},
	{
		"locationName": "Gorakhpur",
		"locationCode": ""
	},
	{
		"locationName": "Goramadagu",
		"locationCode": ""
	},
	{
		"locationName": "Gorantla",
		"locationCode": ""
	},
	{
		"locationName": "Gotegaon",
		"locationCode": ""
	},
	{
		"locationName": "Gownipalli",
		"locationCode": ""
	},
	{
		"locationName": "Gudivada",
		"locationCode": ""
	},
	{
		"locationName": "Gudiyatham",
		"locationCode": ""
	},
	{
		"locationName": "Gudlavalleru",
		"locationCode": ""
	},
	{
		"locationName": "Gudur",
		"locationCode": ""
	},
	{
		"locationName": "Guhagar",
		"locationCode": ""
	},
	{
		"locationName": "Gulaothi",
		"locationCode": ""
	},
	{
		"locationName": "Guledgudda",
		"locationCode": ""
	},
	{
		"locationName": "Gummadidala",
		"locationCode": ""
	},
	{
		"locationName": "Guna",
		"locationCode": ""
	},
	{
		"locationName": "Gundlupet",
		"locationCode": ""
	},
	{
		"locationName": "Guntakal",
		"locationCode": ""
	},
	{
		"locationName": "Guntur",
		"locationCode": ""
	},
	{
		"locationName": "Gurap",
		"locationCode": ""
	},
	{
		"locationName": "Gurazala",
		"locationCode": ""
	},
	{
		"locationName": "Gurdaspur",
		"locationCode": ""
	},
	{
		"locationName": "Guruvayur",
		"locationCode": ""
	},
	{
		"locationName": "Guwahati",
		"locationCode": ""
	},
	{
		"locationName": "Gwalior",
		"locationCode": ""
	},
	{
		"locationName": "Habra",
		"locationCode": ""
	},
	{
		"locationName": "Haflong",
		"locationCode": ""
	},
	{
		"locationName": "Hagaribommanahalli",
		"locationCode": ""
	},
	{
		"locationName": "Hajipur",
		"locationCode": ""
	},
	{
		"locationName": "Haldia",
		"locationCode": ""
	},
	{
		"locationName": "Halduchaur",
		"locationCode": ""
	},
	{
		"locationName": "Haldwani",
		"locationCode": ""
	},
	{
		"locationName": "Haliya",
		"locationCode": ""
	},
	{
		"locationName": "Halol",
		"locationCode": ""
	},
	{
		"locationName": "Hamirpur (HP)",
		"locationCode": ""
	},
	{
		"locationName": "Hampi",
		"locationCode": ""
	},
	{
		"locationName": "Handwara",
		"locationCode": ""
	},
	{
		"locationName": "Hanuman Junction",
		"locationCode": ""
	},
	{
		"locationName": "Hanumangarh",
		"locationCode": ""
	},
	{
		"locationName": "Hapur",
		"locationCode": ""
	},
	{
		"locationName": "Harda",
		"locationCode": ""
	},
	{
		"locationName": "Hardoi",
		"locationCode": ""
	},
	{
		"locationName": "Haria",
		"locationCode": ""
	},
	{
		"locationName": "Haridwar",
		"locationCode": ""
	},
	{
		"locationName": "Harihar",
		"locationCode": ""
	},
	{
		"locationName": "Haripad",
		"locationCode": ""
	},
	{
		"locationName": "Harugeri",
		"locationCode": ""
	},
	{
		"locationName": "Harur",
		"locationCode": ""
	},
	{
		"locationName": "Hasanparthy",
		"locationCode": ""
	},
	{
		"locationName": "Hasanparthy",
		"locationCode": ""
	},
	{
		"locationName": "Hasanpur",
		"locationCode": ""
	},
	{
		"locationName": "Hasnabad",
		"locationCode": ""
	},
	{
		"locationName": "Hassan",
		"locationCode": ""
	},
	{
		"locationName": "Hathras",
		"locationCode": ""
	},
	{
		"locationName": "Haveri",
		"locationCode": ""
	},
	{
		"locationName": "Hazaribagh",
		"locationCode": ""
	},
	{
		"locationName": "Himmatnagar",
		"locationCode": ""
	},
	{
		"locationName": "Hindaun City",
		"locationCode": ""
	},
	{
		"locationName": "Hindupur",
		"locationCode": ""
	},
	{
		"locationName": "Hinganghat",
		"locationCode": ""
	},
	{
		"locationName": "Hingoli",
		"locationCode": ""
	},
	{
		"locationName": "Hiramandalam",
		"locationCode": ""
	},
	{
		"locationName": "Hirekerur",
		"locationCode": ""
	},
	{
		"locationName": "Hiriyur",
		"locationCode": ""
	},
	{
		"locationName": "Hisar",
		"locationCode": ""
	},
	{
		"locationName": "Holenarasipura",
		"locationCode": ""
	},
	{
		"locationName": "Honnali",
		"locationCode": ""
	},
	{
		"locationName": "Honnavara",
		"locationCode": ""
	},
	{
		"locationName": "Hooghly",
		"locationCode": ""
	},
	{
		"locationName": "Hoshangabad",
		"locationCode": ""
	},
	{
		"locationName": "Hoshiarpur",
		"locationCode": ""
	},
	{
		"locationName": "Hoskote",
		"locationCode": ""
	},
	{
		"locationName": "Hospet",
		"locationCode": ""
	},
	{
		"locationName": "Hosur",
		"locationCode": ""
	},
	{
		"locationName": "Howrah",
		"locationCode": ""
	},
	{
		"locationName": "Hubballi (Hubli)",
		"locationCode": ""
	},
	{
		"locationName": "Hunagunda",
		"locationCode": ""
	},
	{
		"locationName": "Hunsur",
		"locationCode": ""
	},
	{
		"locationName": "Husnabad",
		"locationCode": ""
	},
	{
		"locationName": "Huvinahadagali",
		"locationCode": ""
	},
	{
		"locationName": "Huzurabad",
		"locationCode": ""
	},
	{
		"locationName": "Huzurnagar",
		"locationCode": ""
	},
	{
		"locationName": "Ichalkaranji",
		"locationCode": ""
	},
	{
		"locationName": "Ichchapuram",
		"locationCode": ""
	},
	{
		"locationName": "Idappadi",
		"locationCode": ""
	},
	{
		"locationName": "Idar",
		"locationCode": ""
	},
	{
		"locationName": "Idukki",
		"locationCode": ""
	},
	{
		"locationName": "Ieeja",
		"locationCode": ""
	},
	{
		"locationName": "Imphal",
		"locationCode": ""
	},
	{
		"locationName": "Indapur",
		"locationCode": ""
	},
	{
		"locationName": "Indi",
		"locationCode": ""
	},
	{
		"locationName": "Indore",
		"locationCode": ""
	},
	{
		"locationName": "Indukurpeta",
		"locationCode": ""
	},
	{
		"locationName": "Irinjalakuda",
		"locationCode": ""
	},
	{
		"locationName": "Itanagar",
		"locationCode": ""
	},
	{
		"locationName": "Itarsi",
		"locationCode": ""
	},
	{
		"locationName": "Jabalpur",
		"locationCode": ""
	},
	{
		"locationName": "Jadcherla",
		"locationCode": ""
	},
	{
		"locationName": "Jagalur",
		"locationCode": ""
	},
	{
		"locationName": "Jagatdal",
		"locationCode": ""
	},
	{
		"locationName": "Jagdalpur",
		"locationCode": ""
	},
	{
		"locationName": "Jaggampeta",
		"locationCode": ""
	},
	{
		"locationName": "Jaggayyapeta",
		"locationCode": ""
	},
	{
		"locationName": "Jagraon",
		"locationCode": ""
	},
	{
		"locationName": "Jagtial",
		"locationCode": ""
	},
	{
		"locationName": "Jaipur",
		"locationCode": ""
	},
	{
		"locationName": "Jaisalmer",
		"locationCode": ""
	},
	{
		"locationName": "Jajpur Road",
		"locationCode": ""
	},
	{
		"locationName": "Jajpur Town (Odisha)",
		"locationCode": ""
	},
	{
		"locationName": "Jalakandapuram",
		"locationCode": ""
	},
	{
		"locationName": "Jalalabad",
		"locationCode": ""
	},
	{
		"locationName": "Jalandhar",
		"locationCode": ""
	},
	{
		"locationName": "Jalaun",
		"locationCode": ""
	},
	{
		"locationName": "Jalgaon",
		"locationCode": ""
	},
	{
		"locationName": "Jalna",
		"locationCode": ""
	},
	{
		"locationName": "Jalore",
		"locationCode": ""
	},
	{
		"locationName": "Jalpaiguri",
		"locationCode": ""
	},
	{
		"locationName": "Jami",
		"locationCode": ""
	},
	{
		"locationName": "Jamkhandi",
		"locationCode": ""
	},
	{
		"locationName": "Jamkhed",
		"locationCode": ""
	},
	{
		"locationName": "Jammalamadugu",
		"locationCode": ""
	},
	{
		"locationName": "Jammikunta",
		"locationCode": ""
	},
	{
		"locationName": "Jammu",
		"locationCode": ""
	},
	{
		"locationName": "Jamnagar",
		"locationCode": ""
	},
	{
		"locationName": "Jamner",
		"locationCode": ""
	},
	{
		"locationName": "Jamshedpur",
		"locationCode": ""
	},
	{
		"locationName": "Jamui",
		"locationCode": ""
	},
	{
		"locationName": "Jangaon",
		"locationCode": ""
	},
	{
		"locationName": "Jangareddy Gudem",
		"locationCode": ""
	},
	{
		"locationName": "Janjgir",
		"locationCode": ""
	},
	{
		"locationName": "Jaora",
		"locationCode": ""
	},
	{
		"locationName": "Jasdan",
		"locationCode": ""
	},
	{
		"locationName": "Jashpur",
		"locationCode": ""
	},
	{
		"locationName": "Jatni",
		"locationCode": ""
	},
	{
		"locationName": "Jaunpur",
		"locationCode": ""
	},
	{
		"locationName": "Jayamkondacholapuram",
		"locationCode": ""
	},
	{
		"locationName": "Jaysingpur",
		"locationCode": ""
	},
	{
		"locationName": "Jehanabad",
		"locationCode": ""
	},
	{
		"locationName": "Jejuri",
		"locationCode": ""
	},
	{
		"locationName": "Jetpur",
		"locationCode": ""
	},
	{
		"locationName": "Jewar",
		"locationCode": ""
	},
	{
		"locationName": "Jeypore",
		"locationCode": ""
	},
	{
		"locationName": "Jhabua",
		"locationCode": ""
	},
	{
		"locationName": "Jhajha",
		"locationCode": ""
	},
	{
		"locationName": "Jhajjar",
		"locationCode": ""
	},
	{
		"locationName": "Jhansi",
		"locationCode": ""
	},
	{
		"locationName": "Jhargram",
		"locationCode": ""
	},
	{
		"locationName": "Jharsuguda",
		"locationCode": ""
	},
	{
		"locationName": "Jhunjhunu",
		"locationCode": ""
	},
	{
		"locationName": "Jiaganj",
		"locationCode": ""
	},
	{
		"locationName": "Jigani",
		"locationCode": ""
	},
	{
		"locationName": "Jind",
		"locationCode": ""
	},
	{
		"locationName": "Jintur",
		"locationCode": ""
	},
	{
		"locationName": "Jirapur",
		"locationCode": ""
	},
	{
		"locationName": "Jodhpur",
		"locationCode": ""
	},
	{
		"locationName": "Jolarpettai",
		"locationCode": ""
	},
	{
		"locationName": "Jorhat",
		"locationCode": ""
	},
	{
		"locationName": "Joynagar Majilpur",
		"locationCode": ""
	},
	{
		"locationName": "Junagadh",
		"locationCode": ""
	},
	{
		"locationName": "Junagarh",
		"locationCode": ""
	},
	{
		"locationName": "K.D Peta",
		"locationCode": ""
	},
	{
		"locationName": "Kadakkal",
		"locationCode": ""
	},
	{
		"locationName": "Kadapa",
		"locationCode": ""
	},
	{
		"locationName": "Kadi",
		"locationCode": ""
	},
	{
		"locationName": "Kadiri",
		"locationCode": ""
	},
	{
		"locationName": "Kadiyam",
		"locationCode": ""
	},
	{
		"locationName": "Kadthal",
		"locationCode": ""
	},
	{
		"locationName": "Kaikaluru",
		"locationCode": ""
	},
	{
		"locationName": "Kaithal",
		"locationCode": ""
	},
	{
		"locationName": "Kakarapalli",
		"locationCode": ""
	},
	{
		"locationName": "Kakinada",
		"locationCode": ""
	},
	{
		"locationName": "Kalaburagi (Gulbarga)",
		"locationCode": ""
	},
	{
		"locationName": "Kalady",
		"locationCode": ""
	},
	{
		"locationName": "Kalanaur",
		"locationCode": ""
	},
	{
		"locationName": "Kalimpong",
		"locationCode": ""
	},
	{
		"locationName": "Kalla",
		"locationCode": ""
	},
	{
		"locationName": "Kallachi",
		"locationCode": ""
	},
	{
		"locationName": "Kalladikode",
		"locationCode": ""
	},
	{
		"locationName": "Kallakurichi",
		"locationCode": ""
	},
	{
		"locationName": "Kallur",
		"locationCode": ""
	},
	{
		"locationName": "Kalluru",
		"locationCode": ""
	},
	{
		"locationName": "Kalna",
		"locationCode": ""
	},
	{
		"locationName": "Kalol (Gandhinagar)",
		"locationCode": ""
	},
	{
		"locationName": "Kalol (Panchmahal)",
		"locationCode": ""
	},
	{
		"locationName": "Kalwakurthy",
		"locationCode": ""
	},
	{
		"locationName": "Kalyani",
		"locationCode": ""
	},
	{
		"locationName": "Kamalaapur",
		"locationCode": ""
	},
	{
		"locationName": "Kamalapur",
		"locationCode": ""
	},
	{
		"locationName": "Kamanaickenpalayam",
		"locationCode": ""
	},
	{
		"locationName": "Kamareddy",
		"locationCode": ""
	},
	{
		"locationName": "Kamavarapukota",
		"locationCode": ""
	},
	{
		"locationName": "Kambainallur",
		"locationCode": ""
	},
	{
		"locationName": "Kamptee",
		"locationCode": ""
	},
	{
		"locationName": "Kamrej",
		"locationCode": ""
	},
	{
		"locationName": "Kanakapura",
		"locationCode": ""
	},
	{
		"locationName": "Kanatal",
		"locationCode": ""
	},
	{
		"locationName": "Kanchikacherla",
		"locationCode": ""
	},
	{
		"locationName": "Kanchipuram",
		"locationCode": ""
	},
	{
		"locationName": "Kandamangalam",
		"locationCode": ""
	},
	{
		"locationName": "Kandukur",
		"locationCode": ""
	},
	{
		"locationName": "Kangayam",
		"locationCode": ""
	},
	{
		"locationName": "Kangra",
		"locationCode": ""
	},
	{
		"locationName": "Kanhangad",
		"locationCode": ""
	},
	{
		"locationName": "Kanichar",
		"locationCode": ""
	},
	{
		"locationName": "Kanigiri",
		"locationCode": ""
	},
	{
		"locationName": "Kanipakam",
		"locationCode": ""
	},
	{
		"locationName": "Kanjirappally",
		"locationCode": ""
	},
	{
		"locationName": "Kankavli",
		"locationCode": ""
	},
	{
		"locationName": "Kanker",
		"locationCode": ""
	},
	{
		"locationName": "Kankipadu",
		"locationCode": ""
	},
	{
		"locationName": "Kankroli",
		"locationCode": ""
	},
	{
		"locationName": "Kannauj",
		"locationCode": ""
	},
	{
		"locationName": "Kannur",
		"locationCode": ""
	},
	{
		"locationName": "Kanpur",
		"locationCode": ""
	},
	{
		"locationName": "Kantabanji",
		"locationCode": ""
	},
	{
		"locationName": "Kanyakumari",
		"locationCode": ""
	},
	{
		"locationName": "Kapadvanj",
		"locationCode": ""
	},
	{
		"locationName": "Kapurthala",
		"locationCode": ""
	},
	{
		"locationName": "Karad",
		"locationCode": ""
	},
	{
		"locationName": "Karaikal",
		"locationCode": ""
	},
	{
		"locationName": "Karambakkudi",
		"locationCode": ""
	},
	{
		"locationName": "Karanja Lad",
		"locationCode": ""
	},
	{
		"locationName": "Karanjia",
		"locationCode": ""
	},
	{
		"locationName": "Kareli",
		"locationCode": ""
	},
	{
		"locationName": "Karepalli",
		"locationCode": ""
	},
	{
		"locationName": "Kargi Road",
		"locationCode": ""
	},
	{
		"locationName": "Karimangalam",
		"locationCode": ""
	},
	{
		"locationName": "Karimganj",
		"locationCode": ""
	},
	{
		"locationName": "Karimnagar",
		"locationCode": ""
	},
	{
		"locationName": "Kariyad",
		"locationCode": ""
	},
	{
		"locationName": "Karjat",
		"locationCode": ""
	},
	{
		"locationName": "Karkala",
		"locationCode": ""
	},
	{
		"locationName": "Karmala",
		"locationCode": ""
	},
	{
		"locationName": "Karmamthody",
		"locationCode": ""
	},
	{
		"locationName": "Karnal",
		"locationCode": ""
	},
	{
		"locationName": "Karunagapally",
		"locationCode": ""
	},
	{
		"locationName": "Karur",
		"locationCode": ""
	},
	{
		"locationName": "Karwar",
		"locationCode": ""
	},
	{
		"locationName": "Kasaragod",
		"locationCode": ""
	},
	{
		"locationName": "Kasdol",
		"locationCode": ""
	},
	{
		"locationName": "Kasganj",
		"locationCode": ""
	},
	{
		"locationName": "Kashig",
		"locationCode": ""
	},
	{
		"locationName": "Kashipur",
		"locationCode": ""
	},
	{
		"locationName": "Kashti",
		"locationCode": ""
	},
	{
		"locationName": "Kasibugga",
		"locationCode": ""
	},
	{
		"locationName": "Katghora",
		"locationCode": ""
	},
	{
		"locationName": "Kathipudi",
		"locationCode": ""
	},
	{
		"locationName": "Kathmandu",
		"locationCode": ""
	},
	{
		"locationName": "Kathua",
		"locationCode": ""
	},
	{
		"locationName": "Katihar",
		"locationCode": ""
	},
	{
		"locationName": "Katni",
		"locationCode": ""
	},
	{
		"locationName": "Katra",
		"locationCode": ""
	},
	{
		"locationName": "Katrenikona",
		"locationCode": ""
	},
	{
		"locationName": "Kattappana",
		"locationCode": ""
	},
	{
		"locationName": "Katwa",
		"locationCode": ""
	},
	{
		"locationName": "Kavali",
		"locationCode": ""
	},
	{
		"locationName": "Kaveripattinam",
		"locationCode": ""
	},
	{
		"locationName": "Kaviti",
		"locationCode": ""
	},
	{
		"locationName": "Kawardha",
		"locationCode": ""
	},
	{
		"locationName": "Kayamkulam",
		"locationCode": ""
	},
	{
		"locationName": "Kazhakkoottam",
		"locationCode": ""
	},
	{
		"locationName": "Kazipet",
		"locationCode": ""
	},
	{
		"locationName": "Kekri",
		"locationCode": ""
	},
	{
		"locationName": "Kendrapara",
		"locationCode": ""
	},
	{
		"locationName": "Keonjhar",
		"locationCode": ""
	},
	{
		"locationName": "Kesamudram",
		"locationCode": ""
	},
	{
		"locationName": "Kesinga",
		"locationCode": ""
	},
	{
		"locationName": "Kevadia",
		"locationCode": ""
	},
	{
		"locationName": "Khachrod",
		"locationCode": ""
	},
	{
		"locationName": "Khadda",
		"locationCode": ""
	},
	{
		"locationName": "Khajani",
		"locationCode": ""
	},
	{
		"locationName": "Khajipet",
		"locationCode": ""
	},
	{
		"locationName": "Khajuraho",
		"locationCode": ""
	},
	{
		"locationName": "Khalilabad",
		"locationCode": ""
	},
	{
		"locationName": "Khambhat",
		"locationCode": ""
	},
	{
		"locationName": "Khamgaon",
		"locationCode": ""
	},
	{
		"locationName": "Khammam",
		"locationCode": ""
	},
	{
		"locationName": "Khanapur",
		"locationCode": ""
	},
	{
		"locationName": "Khandela",
		"locationCode": ""
	},
	{
		"locationName": "Khandwa",
		"locationCode": ""
	},
	{
		"locationName": "Khanna",
		"locationCode": ""
	},
	{
		"locationName": "Kharagpur",
		"locationCode": ""
	},
	{
		"locationName": "Kharghar",
		"locationCode": ""
	},
	{
		"locationName": "Khargone",
		"locationCode": ""
	},
	{
		"locationName": "Khariar Road",
		"locationCode": ""
	},
	{
		"locationName": "Kharsia",
		"locationCode": ""
	},
	{
		"locationName": "Khategaon",
		"locationCode": ""
	},
	{
		"locationName": "Khatima",
		"locationCode": ""
	},
	{
		"locationName": "Khatta",
		"locationCode": ""
	},
	{
		"locationName": "Khed",
		"locationCode": ""
	},
	{
		"locationName": "Kheda",
		"locationCode": ""
	},
	{
		"locationName": "Khedbrahma",
		"locationCode": ""
	},
	{
		"locationName": "Khila",
		"locationCode": ""
	},
	{
		"locationName": "Khopoli",
		"locationCode": ""
	},
	{
		"locationName": "Khowai",
		"locationCode": ""
	},
	{
		"locationName": "Khurja",
		"locationCode": ""
	},
	{
		"locationName": "Kichha",
		"locationCode": ""
	},
	{
		"locationName": "Kim",
		"locationCode": ""
	},
	{
		"locationName": "Kinathukadavu",
		"locationCode": ""
	},
	{
		"locationName": "Kinnaur",
		"locationCode": ""
	},
	{
		"locationName": "Kirlampudi",
		"locationCode": ""
	},
	{
		"locationName": "Kishanganj",
		"locationCode": ""
	},
	{
		"locationName": "Kishangarh",
		"locationCode": ""
	},
	{
		"locationName": "Kodad",
		"locationCode": ""
	},
	{
		"locationName": "Kodagu (Coorg)",
		"locationCode": ""
	},
	{
		"locationName": "Kodaikanal",
		"locationCode": ""
	},
	{
		"locationName": "Kodakara",
		"locationCode": ""
	},
	{
		"locationName": "Kodaly",
		"locationCode": ""
	},
	{
		"locationName": "Koderma",
		"locationCode": ""
	},
	{
		"locationName": "Kodumur",
		"locationCode": ""
	},
	{
		"locationName": "Kodumuru",
		"locationCode": ""
	},
	{
		"locationName": "Kodungallur",
		"locationCode": ""
	},
	{
		"locationName": "Kohima",
		"locationCode": ""
	},
	{
		"locationName": "Koilkuntla",
		"locationCode": ""
	},
	{
		"locationName": "Kokrajhar",
		"locationCode": ""
	},
	{
		"locationName": "Kolar",
		"locationCode": ""
	},
	{
		"locationName": "Kolhapur",
		"locationCode": ""
	},
	{
		"locationName": "Kollam",
		"locationCode": ""
	},
	{
		"locationName": "Kollapur",
		"locationCode": ""
	},
	{
		"locationName": "Kollengode",
		"locationCode": ""
	},
	{
		"locationName": "Komarapalayam",
		"locationCode": ""
	},
	{
		"locationName": "Kondagaon",
		"locationCode": ""
	},
	{
		"locationName": "Kondlahalli",
		"locationCode": ""
	},
	{
		"locationName": "Konithiwada",
		"locationCode": ""
	},
	{
		"locationName": "Konni",
		"locationCode": ""
	},
	{
		"locationName": "Koothattukulam",
		"locationCode": ""
	},
	{
		"locationName": "Kopargaon",
		"locationCode": ""
	},
	{
		"locationName": "Koppam",
		"locationCode": ""
	},
	{
		"locationName": "Koraput",
		"locationCode": ""
	},
	{
		"locationName": "Koratagere",
		"locationCode": ""
	},
	{
		"locationName": "Korba",
		"locationCode": ""
	},
	{
		"locationName": "Korutla",
		"locationCode": ""
	},
	{
		"locationName": "Korwa",
		"locationCode": ""
	},
	{
		"locationName": "Kosamba",
		"locationCode": ""
	},
	{
		"locationName": "Kosgi",
		"locationCode": ""
	},
	{
		"locationName": "Kota",
		"locationCode": ""
	},
	{
		"locationName": "Kota (AP)",
		"locationCode": ""
	},
	{
		"locationName": "Kotabommali",
		"locationCode": ""
	},
	{
		"locationName": "Kotananduru",
		"locationCode": ""
	},
	{
		"locationName": "Kotdwara",
		"locationCode": ""
	},
	{
		"locationName": "Kothacheruvu",
		"locationCode": ""
	},
	{
		"locationName": "Kothagudem",
		"locationCode": ""
	},
	{
		"locationName": "Kothakota",
		"locationCode": ""
	},
	{
		"locationName": "Kothamangalam",
		"locationCode": ""
	},
	{
		"locationName": "Kothapalli",
		"locationCode": ""
	},
	{
		"locationName": "Kothapeta",
		"locationCode": ""
	},
	{
		"locationName": "Kothavalasa",
		"locationCode": ""
	},
	{
		"locationName": "Kotkapura",
		"locationCode": ""
	},
	{
		"locationName": "Kotma",
		"locationCode": ""
	},
	{
		"locationName": "Kotpad",
		"locationCode": ""
	},
	{
		"locationName": "Kotputli",
		"locationCode": ""
	},
	{
		"locationName": "Kottayam",
		"locationCode": ""
	},
	{
		"locationName": "Kottayi",
		"locationCode": ""
	},
	{
		"locationName": "Kottiyam",
		"locationCode": ""
	},
	{
		"locationName": "Kotturu",
		"locationCode": ""
	},
	{
		"locationName": "Kovilpatti",
		"locationCode": ""
	},
	{
		"locationName": "Kovur (Nellore)",
		"locationCode": ""
	},
	{
		"locationName": "Kovvur",
		"locationCode": ""
	},
	{
		"locationName": "Koyyalagudem",
		"locationCode": ""
	},
	{
		"locationName": "Kozhikode",
		"locationCode": ""
	},
	{
		"locationName": "Kozhinjampara",
		"locationCode": ""
	},
	{
		"locationName": "Krishnagiri",
		"locationCode": ""
	},
	{
		"locationName": "Krishnanagar",
		"locationCode": ""
	},
	{
		"locationName": "Krishnarajanagara",
		"locationCode": ""
	},
	{
		"locationName": "Krishnarajpete (K.R.Pete)",
		"locationCode": ""
	},
	{
		"locationName": "Krosuru",
		"locationCode": ""
	},
	{
		"locationName": "Kruthivennu",
		"locationCode": ""
	},
	{
		"locationName": "Kuchaman City",
		"locationCode": ""
	},
	{
		"locationName": "Kuchipudi",
		"locationCode": ""
	},
	{
		"locationName": "Kudus",
		"locationCode": ""
	},
	{
		"locationName": "Kujang",
		"locationCode": ""
	},
	{
		"locationName": "Kukshi",
		"locationCode": ""
	},
	{
		"locationName": "Kulithalai",
		"locationCode": ""
	},
	{
		"locationName": "Kullu",
		"locationCode": ""
	},
	{
		"locationName": "Kumarakom",
		"locationCode": ""
	},
	{
		"locationName": "Kumbakonam",
		"locationCode": ""
	},
	{
		"locationName": "Kumily",
		"locationCode": ""
	},
	{
		"locationName": "Kunda",
		"locationCode": ""
	},
	{
		"locationName": "Kundapura",
		"locationCode": ""
	},
	{
		"locationName": "Kunigal",
		"locationCode": ""
	},
	{
		"locationName": "Kunkuri",
		"locationCode": ""
	},
	{
		"locationName": "Kunnamkulam",
		"locationCode": ""
	},
	{
		"locationName": "Kuravilangad",
		"locationCode": ""
	},
	{
		"locationName": "Kurnool",
		"locationCode": ""
	},
	{
		"locationName": "Kurseong",
		"locationCode": ""
	},
	{
		"locationName": "Kurud",
		"locationCode": ""
	},
	{
		"locationName": "Kurukshetra",
		"locationCode": ""
	},
	{
		"locationName": "Kurumaseri",
		"locationCode": ""
	},
	{
		"locationName": "Kurundwad",
		"locationCode": ""
	},
	{
		"locationName": "Kushalnagar",
		"locationCode": ""
	},
	{
		"locationName": "Kushinagar",
		"locationCode": ""
	},
	{
		"locationName": "Kusumgram",
		"locationCode": ""
	},
	{
		"locationName": "Kutch",
		"locationCode": ""
	},
	{
		"locationName": "Kuthuparamba",
		"locationCode": ""
	},
	{
		"locationName": "Ladakh",
		"locationCode": ""
	},
	{
		"locationName": "Lakhanpur",
		"locationCode": ""
	},
	{
		"locationName": "Lakhimpur",
		"locationCode": ""
	},
	{
		"locationName": "Lakhimpur Kheri",
		"locationCode": ""
	},
	{
		"locationName": "Lakhisarai",
		"locationCode": ""
	},
	{
		"locationName": "Lakkavaram",
		"locationCode": ""
	},
	{
		"locationName": "Lakshmeshwara",
		"locationCode": ""
	},
	{
		"locationName": "Lakshmikantapur",
		"locationCode": ""
	},
	{
		"locationName": "Lalgudi",
		"locationCode": ""
	},
	{
		"locationName": "Lalitpur",
		"locationCode": ""
	},
	{
		"locationName": "Lansdowne",
		"locationCode": ""
	},
	{
		"locationName": "Latur",
		"locationCode": ""
	},
	{
		"locationName": "Lavasa",
		"locationCode": ""
	},
	{
		"locationName": "Leeja",
		"locationCode": ""
	},
	{
		"locationName": "Leh",
		"locationCode": ""
	},
	{
		"locationName": "Lingasugur",
		"locationCode": ""
	},
	{
		"locationName": "Lohardaga",
		"locationCode": ""
	},
	{
		"locationName": "Lonand",
		"locationCode": ""
	},
	{
		"locationName": "Lonar",
		"locationCode": ""
	},
	{
		"locationName": "Lonavala",
		"locationCode": ""
	},
	{
		"locationName": "Loni",
		"locationCode": ""
	},
	{
		"locationName": "Lucknow",
		"locationCode": ""
	},
	{
		"locationName": "Ludhiana",
		"locationCode": ""
	},
	{
		"locationName": "Lunawada",
		"locationCode": ""
	},
	{
		"locationName": "Luxettipet",
		"locationCode": ""
	},
	{
		"locationName": "MUNNAR",
		"locationCode": ""
	},
	{
		"locationName": "Macherla",
		"locationCode": ""
	},
	{
		"locationName": "Machilipatnam",
		"locationCode": ""
	},
	{
		"locationName": "Madalu",
		"locationCode": ""
	},
	{
		"locationName": "Madanapalle",
		"locationCode": ""
	},
	{
		"locationName": "Maddur",
		"locationCode": ""
	},
	{
		"locationName": "Madhavaram",
		"locationCode": ""
	},
	{
		"locationName": "Madhepura",
		"locationCode": ""
	},
	{
		"locationName": "Madhira",
		"locationCode": ""
	},
	{
		"locationName": "Madikeri",
		"locationCode": ""
	},
	{
		"locationName": "Madugula",
		"locationCode": ""
	},
	{
		"locationName": "Madurai",
		"locationCode": ""
	},
	{
		"locationName": "Magadi",
		"locationCode": ""
	},
	{
		"locationName": "Mahabaleshwar",
		"locationCode": ""
	},
	{
		"locationName": "Mahabubabad",
		"locationCode": ""
	},
	{
		"locationName": "Mahad",
		"locationCode": ""
	},
	{
		"locationName": "Mahalingpur",
		"locationCode": ""
	},
	{
		"locationName": "Maharajganj",
		"locationCode": ""
	},
	{
		"locationName": "Mahasamund",
		"locationCode": ""
	},
	{
		"locationName": "Mahbubnagar",
		"locationCode": ""
	},
	{
		"locationName": "Mahemdavad",
		"locationCode": ""
	},
	{
		"locationName": "Maheshtala",
		"locationCode": ""
	},
	{
		"locationName": "Maheshwar",
		"locationCode": ""
	},
	{
		"locationName": "Maheshwaram",
		"locationCode": ""
	},
	{
		"locationName": "Mahishadal",
		"locationCode": ""
	},
	{
		"locationName": "Mahudha",
		"locationCode": ""
	},
	{
		"locationName": "Mahuva",
		"locationCode": ""
	},
	{
		"locationName": "Makrana",
		"locationCode": ""
	},
	{
		"locationName": "Makthal",
		"locationCode": ""
	},
	{
		"locationName": "Malappuram",
		"locationCode": ""
	},
	{
		"locationName": "Malda",
		"locationCode": ""
	},
	{
		"locationName": "Malebennur",
		"locationCode": ""
	},
	{
		"locationName": "Malegaon",
		"locationCode": ""
	},
	{
		"locationName": "Malerkotla",
		"locationCode": ""
	},
	{
		"locationName": "Malikipuram",
		"locationCode": ""
	},
	{
		"locationName": "Malkangiri",
		"locationCode": ""
	},
	{
		"locationName": "Malkapur",
		"locationCode": ""
	},
	{
		"locationName": "Mall",
		"locationCode": ""
	},
	{
		"locationName": "Malout",
		"locationCode": ""
	},
	{
		"locationName": "Malur",
		"locationCode": ""
	},
	{
		"locationName": "Mamallapuram",
		"locationCode": ""
	},
	{
		"locationName": "Manali",
		"locationCode": ""
	},
	{
		"locationName": "Manamadurai",
		"locationCode": ""
	},
	{
		"locationName": "Mananthavady",
		"locationCode": ""
	},
	{
		"locationName": "Manapparai",
		"locationCode": ""
	},
	{
		"locationName": "Manawar",
		"locationCode": ""
	},
	{
		"locationName": "Mancherial",
		"locationCode": ""
	},
	{
		"locationName": "Mandapeta",
		"locationCode": ""
	},
	{
		"locationName": "Mandarmoni",
		"locationCode": ""
	},
	{
		"locationName": "Mandasa",
		"locationCode": ""
	},
	{
		"locationName": "Mandav",
		"locationCode": ""
	},
	{
		"locationName": "Mandawa",
		"locationCode": ""
	},
	{
		"locationName": "Mandi",
		"locationCode": ""
	},
	{
		"locationName": "Mandi Dabwali",
		"locationCode": ""
	},
	{
		"locationName": "Mandi Gobindgarh",
		"locationCode": ""
	},
	{
		"locationName": "Mandla",
		"locationCode": ""
	},
	{
		"locationName": "Mandsaur",
		"locationCode": ""
	},
	{
		"locationName": "Mandvi",
		"locationCode": ""
	},
	{
		"locationName": "Mandwa",
		"locationCode": ""
	},
	{
		"locationName": "Mandya",
		"locationCode": ""
	},
	{
		"locationName": "Manendragarh",
		"locationCode": ""
	},
	{
		"locationName": "Mangalagiri",
		"locationCode": ""
	},
	{
		"locationName": "Mangaldoi",
		"locationCode": ""
	},
	{
		"locationName": "Mangaluru (Mangalore)",
		"locationCode": ""
	},
	{
		"locationName": "Mangar",
		"locationCode": ""
	},
	{
		"locationName": "Manikonda (AP)",
		"locationCode": ""
	},
	{
		"locationName": "Manipal",
		"locationCode": ""
	},
	{
		"locationName": "Manjeri",
		"locationCode": ""
	},
	{
		"locationName": "Manmad",
		"locationCode": ""
	},
	{
		"locationName": "Mannargudi",
		"locationCode": ""
	},
	{
		"locationName": "Mannarkkad",
		"locationCode": ""
	},
	{
		"locationName": "Mannur",
		"locationCode": ""
	},
	{
		"locationName": "Mansa",
		"locationCode": ""
	},
	{
		"locationName": "Manthani",
		"locationCode": ""
	},
	{
		"locationName": "Manuguru",
		"locationCode": ""
	},
	{
		"locationName": "Manvi",
		"locationCode": ""
	},
	{
		"locationName": "Maraimalai Nagar",
		"locationCode": ""
	},
	{
		"locationName": "Marayur",
		"locationCode": ""
	},
	{
		"locationName": "Margao",
		"locationCode": ""
	},
	{
		"locationName": "Margherita",
		"locationCode": ""
	},
	{
		"locationName": "Markapur",
		"locationCode": ""
	},
	{
		"locationName": "Marpalle",
		"locationCode": ""
	},
	{
		"locationName": "Marripeda",
		"locationCode": ""
	},
	{
		"locationName": "Marthandam",
		"locationCode": ""
	},
	{
		"locationName": "Martur",
		"locationCode": ""
	},
	{
		"locationName": "Maslandapur",
		"locationCode": ""
	},
	{
		"locationName": "Math Chandipur",
		"locationCode": ""
	},
	{
		"locationName": "Mathabhanga",
		"locationCode": ""
	},
	{
		"locationName": "Mathura",
		"locationCode": ""
	},
	{
		"locationName": "Mattannur",
		"locationCode": ""
	},
	{
		"locationName": "Mau",
		"locationCode": ""
	},
	{
		"locationName": "Mavelikkara",
		"locationCode": ""
	},
	{
		"locationName": "Mayannur",
		"locationCode": ""
	},
	{
		"locationName": "Mayiladuthurai",
		"locationCode": ""
	},
	{
		"locationName": "Medak",
		"locationCode": ""
	},
	{
		"locationName": "Medarametla",
		"locationCode": ""
	},
	{
		"locationName": "Medchal",
		"locationCode": ""
	},
	{
		"locationName": "Medininagar",
		"locationCode": ""
	},
	{
		"locationName": "Meerut",
		"locationCode": ""
	},
	{
		"locationName": "Mehkar",
		"locationCode": ""
	},
	{
		"locationName": "Mehsana",
		"locationCode": ""
	},
	{
		"locationName": "Melattur",
		"locationCode": ""
	},
	{
		"locationName": "Melli",
		"locationCode": ""
	},
	{
		"locationName": "Memari",
		"locationCode": ""
	},
	{
		"locationName": "Metpally",
		"locationCode": ""
	},
	{
		"locationName": "Mettuppalayam",
		"locationCode": ""
	},
	{
		"locationName": "Mettur",
		"locationCode": ""
	},
	{
		"locationName": "Mhow",
		"locationCode": ""
	},
	{
		"locationName": "Midnapore",
		"locationCode": ""
	},
	{
		"locationName": "Miraj",
		"locationCode": ""
	},
	{
		"locationName": "Mirganj",
		"locationCode": ""
	},
	{
		"locationName": "Miryalaguda",
		"locationCode": ""
	},
	{
		"locationName": "Mirzapur",
		"locationCode": ""
	},
	{
		"locationName": "Moga",
		"locationCode": ""
	},
	{
		"locationName": "Mohali",
		"locationCode": ""
	},
	{
		"locationName": "Mokama",
		"locationCode": ""
	},
	{
		"locationName": "Molakalmuru",
		"locationCode": ""
	},
	{
		"locationName": "Mominpet",
		"locationCode": ""
	},
	{
		"locationName": "Moodbidri",
		"locationCode": ""
	},
	{
		"locationName": "Moradabad",
		"locationCode": ""
	},
	{
		"locationName": "Moranhat",
		"locationCode": ""
	},
	{
		"locationName": "Morbi",
		"locationCode": ""
	},
	{
		"locationName": "Morena",
		"locationCode": ""
	},
	{
		"locationName": "Morigaon",
		"locationCode": ""
	},
	{
		"locationName": "Morinda",
		"locationCode": ""
	},
	{
		"locationName": "Mothkur",
		"locationCode": ""
	},
	{
		"locationName": "Motihari",
		"locationCode": ""
	},
	{
		"locationName": "Moyna",
		"locationCode": ""
	},
	{
		"locationName": "Mudalagi",
		"locationCode": ""
	},
	{
		"locationName": "Muddebihal",
		"locationCode": ""
	},
	{
		"locationName": "Mudhol",
		"locationCode": ""
	},
	{
		"locationName": "Mudigere",
		"locationCode": ""
	},
	{
		"locationName": "Mughalsarai",
		"locationCode": ""
	},
	{
		"locationName": "Mukerian",
		"locationCode": ""
	},
	{
		"locationName": "Mukkam",
		"locationCode": ""
	},
	{
		"locationName": "Muktsar",
		"locationCode": ""
	},
	{
		"locationName": "Mulbagal",
		"locationCode": ""
	},
	{
		"locationName": "Mulkanoor",
		"locationCode": ""
	},
	{
		"locationName": "Mullanpur",
		"locationCode": ""
	},
	{
		"locationName": "Mulleria",
		"locationCode": ""
	},
	{
		"locationName": "Mulugu",
		"locationCode": ""
	},
	{
		"locationName": "Mulugu Ghanpur",
		"locationCode": ""
	},
	{
		"locationName": "Mummidivaram",
		"locationCode": ""
	},
	{
		"locationName": "Mundakayam",
		"locationCode": ""
	},
	{
		"locationName": "Mundargi",
		"locationCode": ""
	},
	{
		"locationName": "Mundra",
		"locationCode": ""
	},
	{
		"locationName": "Mungra Badshahpur",
		"locationCode": ""
	},
	{
		"locationName": "Muniguda",
		"locationCode": ""
	},
	{
		"locationName": "Muradnagar",
		"locationCode": ""
	},
	{
		"locationName": "Murshidabad",
		"locationCode": ""
	},
	{
		"locationName": "Murtizapur",
		"locationCode": ""
	},
	{
		"locationName": "Musiri",
		"locationCode": ""
	},
	{
		"locationName": "Mussoorie",
		"locationCode": ""
	},
	{
		"locationName": "Muvattupuzha",
		"locationCode": ""
	},
	{
		"locationName": "Muzaffarnagar",
		"locationCode": ""
	},
	{
		"locationName": "Muzaffarpur",
		"locationCode": ""
	},
	{
		"locationName": "Mydukur",
		"locationCode": ""
	},
	{
		"locationName": "Mylavaram",
		"locationCode": ""
	},
	{
		"locationName": "Mysuru (Mysore)",
		"locationCode": ""
	},
	{
		"locationName": "Nabadwip",
		"locationCode": ""
	},
	{
		"locationName": "Nabarangpur",
		"locationCode": ""
	},
	{
		"locationName": "Nabha",
		"locationCode": ""
	},
	{
		"locationName": "Nadia",
		"locationCode": ""
	},
	{
		"locationName": "Nadiad",
		"locationCode": ""
	},
	{
		"locationName": "Nagamangala",
		"locationCode": ""
	},
	{
		"locationName": "Nagaon",
		"locationCode": ""
	},
	{
		"locationName": "Nagapattinam",
		"locationCode": ""
	},
	{
		"locationName": "Nagari",
		"locationCode": ""
	},
	{
		"locationName": "Nagarkurnool",
		"locationCode": ""
	},
	{
		"locationName": "Nagaur",
		"locationCode": ""
	},
	{
		"locationName": "Nagayalanka",
		"locationCode": ""
	},
	{
		"locationName": "Nagda",
		"locationCode": ""
	},
	{
		"locationName": "Nagercoil",
		"locationCode": ""
	},
	{
		"locationName": "Nagothane",
		"locationCode": ""
	},
	{
		"locationName": "Nagpur",
		"locationCode": ""
	},
	{
		"locationName": "Naharlagun",
		"locationCode": ""
	},
	{
		"locationName": "Naidupeta",
		"locationCode": ""
	},
	{
		"locationName": "Naihati",
		"locationCode": ""
	},
	{
		"locationName": "Nainital",
		"locationCode": ""
	},
	{
		"locationName": "Najafgarh",
		"locationCode": ""
	},
	{
		"locationName": "Najibabad",
		"locationCode": ""
	},
	{
		"locationName": "Nakhatrana",
		"locationCode": ""
	},
	{
		"locationName": "Nakodar",
		"locationCode": ""
	},
	{
		"locationName": "Nakrekal",
		"locationCode": ""
	},
	{
		"locationName": "Nalbari",
		"locationCode": ""
	},
	{
		"locationName": "Nalgonda",
		"locationCode": ""
	},
	{
		"locationName": "Nallajerla",
		"locationCode": ""
	},
	{
		"locationName": "Namakkal",
		"locationCode": ""
	},
	{
		"locationName": "Namchi",
		"locationCode": ""
	},
	{
		"locationName": "Namkhana",
		"locationCode": ""
	},
	{
		"locationName": "Namsai",
		"locationCode": ""
	},
	{
		"locationName": "Nandakumar",
		"locationCode": ""
	},
	{
		"locationName": "Nanded",
		"locationCode": ""
	},
	{
		"locationName": "Nandigama",
		"locationCode": ""
	},
	{
		"locationName": "Nandikotkur",
		"locationCode": ""
	},
	{
		"locationName": "Nandipet",
		"locationCode": ""
	},
	{
		"locationName": "Nandurbar",
		"locationCode": ""
	},
	{
		"locationName": "Nandyal",
		"locationCode": ""
	},
	{
		"locationName": "Nanjanagudu",
		"locationCode": ""
	},
	{
		"locationName": "Nanpara",
		"locationCode": ""
	},
	{
		"locationName": "Narasannapeta",
		"locationCode": ""
	},
	{
		"locationName": "Narayankhed",
		"locationCode": ""
	},
	{
		"locationName": "Narayanpet",
		"locationCode": ""
	},
	{
		"locationName": "Narayanpur",
		"locationCode": ""
	},
	{
		"locationName": "Narayanpur (Assam)",
		"locationCode": ""
	},
	{
		"locationName": "Narayanpur (CH)",
		"locationCode": ""
	},
	{
		"locationName": "Nargund",
		"locationCode": ""
	},
	{
		"locationName": "Narnaul",
		"locationCode": ""
	},
	{
		"locationName": "Narsampet",
		"locationCode": ""
	},
	{
		"locationName": "Narsapur",
		"locationCode": ""
	},
	{
		"locationName": "Narsapur (Medak)",
		"locationCode": ""
	},
	{
		"locationName": "Narsinghpur",
		"locationCode": ""
	},
	{
		"locationName": "Narsipatnam",
		"locationCode": ""
	},
	{
		"locationName": "Narwana",
		"locationCode": ""
	},
	{
		"locationName": "Nashik",
		"locationCode": ""
	},
	{
		"locationName": "Natham",
		"locationCode": ""
	},
	{
		"locationName": "Nathdwara",
		"locationCode": ""
	},
	{
		"locationName": "Nautanwa",
		"locationCode": ""
	},
	{
		"locationName": "Navsari",
		"locationCode": ""
	},
	{
		"locationName": "Nawada",
		"locationCode": ""
	},
	{
		"locationName": "Nawalgarh",
		"locationCode": ""
	},
	{
		"locationName": "Nawanshahr",
		"locationCode": ""
	},
	{
		"locationName": "Nawapara",
		"locationCode": ""
	},
	{
		"locationName": "Nayagarh",
		"locationCode": ""
	},
	{
		"locationName": "Nazira",
		"locationCode": ""
	},
	{
		"locationName": "Nazirpur",
		"locationCode": ""
	},
	{
		"locationName": "Nedumbassery",
		"locationCode": ""
	},
	{
		"locationName": "Nedumkandam",
		"locationCode": ""
	},
	{
		"locationName": "Neelapalli",
		"locationCode": ""
	},
	{
		"locationName": "Neemrana",
		"locationCode": ""
	},
	{
		"locationName": "Neemuch",
		"locationCode": ""
	},
	{
		"locationName": "Nelakondapalli",
		"locationCode": ""
	},
	{
		"locationName": "Nelamangala",
		"locationCode": ""
	},
	{
		"locationName": "Nellimarla",
		"locationCode": ""
	},
	{
		"locationName": "Nellimoodu",
		"locationCode": ""
	},
	{
		"locationName": "Nellore",
		"locationCode": ""
	},
	{
		"locationName": "Nemmara",
		"locationCode": ""
	},
	{
		"locationName": "Nenmara",
		"locationCode": ""
	},
	{
		"locationName": "Nepalgunj",
		"locationCode": ""
	},
	{
		"locationName": "Ner Parsopant",
		"locationCode": ""
	},
	{
		"locationName": "Neral",
		"locationCode": ""
	},
	{
		"locationName": "Nereducharla",
		"locationCode": ""
	},
	{
		"locationName": "New Tehri",
		"locationCode": ""
	},
	{
		"locationName": "Neyveli",
		"locationCode": ""
	},
	{
		"locationName": "Nichlaul",
		"locationCode": ""
	},
	{
		"locationName": "Nidadavolu",
		"locationCode": ""
	},
	{
		"locationName": "Nilagiri",
		"locationCode": ""
	},
	{
		"locationName": "Nilakottai",
		"locationCode": ""
	},
	{
		"locationName": "Nilanga",
		"locationCode": ""
	},
	{
		"locationName": "Nimapara",
		"locationCode": ""
	},
	{
		"locationName": "Nimbahera",
		"locationCode": ""
	},
	{
		"locationName": "Nindra",
		"locationCode": ""
	},
	{
		"locationName": "Nipani",
		"locationCode": ""
	},
	{
		"locationName": "Niphad",
		"locationCode": ""
	},
	{
		"locationName": "Nirjuli",
		"locationCode": ""
	},
	{
		"locationName": "Nizamabad",
		"locationCode": ""
	},
	{
		"locationName": "Nokha",
		"locationCode": ""
	},
	{
		"locationName": "Nooranad",
		"locationCode": ""
	},
	{
		"locationName": "Nurpur",
		"locationCode": ""
	},
	{
		"locationName": "Nuzvid",
		"locationCode": ""
	},
	{
		"locationName": "Nyamathi",
		"locationCode": ""
	},
	{
		"locationName": "Oddanchatram",
		"locationCode": ""
	},
	{
		"locationName": "Ojhar",
		"locationCode": ""
	},
	{
		"locationName": "Okha",
		"locationCode": ""
	},
	{
		"locationName": "Ongole",
		"locationCode": ""
	},
	{
		"locationName": "Ooty",
		"locationCode": ""
	},
	{
		"locationName": "Orai",
		"locationCode": ""
	},
	{
		"locationName": "Orchha",
		"locationCode": ""
	},
	{
		"locationName": "Ottapalam",
		"locationCode": ""
	},
	{
		"locationName": "P. Dharmavaram",
		"locationCode": ""
	},
	{
		"locationName": "P.Gannavaram",
		"locationCode": ""
	},
	{
		"locationName": "Padampur",
		"locationCode": ""
	},
	{
		"locationName": "Padrauna",
		"locationCode": ""
	},
	{
		"locationName": "Padubidri",
		"locationCode": ""
	},
	{
		"locationName": "Pakala",
		"locationCode": ""
	},
	{
		"locationName": "Pala",
		"locationCode": ""
	},
	{
		"locationName": "Palakkad",
		"locationCode": ""
	},
	{
		"locationName": "Palakollu",
		"locationCode": ""
	},
	{
		"locationName": "Palakonda",
		"locationCode": ""
	},
	{
		"locationName": "Palakurthy",
		"locationCode": ""
	},
	{
		"locationName": "Palamaner",
		"locationCode": ""
	},
	{
		"locationName": "Palampur",
		"locationCode": ""
	},
	{
		"locationName": "Palani",
		"locationCode": ""
	},
	{
		"locationName": "Palanpur",
		"locationCode": ""
	},
	{
		"locationName": "Palapetty",
		"locationCode": ""
	},
	{
		"locationName": "Palasa",
		"locationCode": ""
	},
	{
		"locationName": "Palghar",
		"locationCode": ""
	},
	{
		"locationName": "Pali",
		"locationCode": ""
	},
	{
		"locationName": "Palia Kalan",
		"locationCode": ""
	},
	{
		"locationName": "Palitana",
		"locationCode": ""
	},
	{
		"locationName": "Palladam",
		"locationCode": ""
	},
	{
		"locationName": "Pallickathodu",
		"locationCode": ""
	},
	{
		"locationName": "Pallipalayam",
		"locationCode": ""
	},
	{
		"locationName": "Palluruthy",
		"locationCode": ""
	},
	{
		"locationName": "Palwal",
		"locationCode": ""
	},
	{
		"locationName": "Palwancha",
		"locationCode": ""
	},
	{
		"locationName": "Pamarru",
		"locationCode": ""
	},
	{
		"locationName": "Pamidi",
		"locationCode": ""
	},
	{
		"locationName": "Pamuru",
		"locationCode": ""
	},
	{
		"locationName": "Panachamoodu",
		"locationCode": ""
	},
	{
		"locationName": "Panaji",
		"locationCode": ""
	},
	{
		"locationName": "Panapakkam",
		"locationCode": ""
	},
	{
		"locationName": "Panchgani",
		"locationCode": ""
	},
	{
		"locationName": "Panchkula",
		"locationCode": ""
	},
	{
		"locationName": "Pandalam",
		"locationCode": ""
	},
	{
		"locationName": "Pandavapura",
		"locationCode": ""
	},
	{
		"locationName": "Pandhana",
		"locationCode": ""
	},
	{
		"locationName": "Pandharkawada",
		"locationCode": ""
	},
	{
		"locationName": "Pandharpur",
		"locationCode": ""
	},
	{
		"locationName": "Pandua",
		"locationCode": ""
	},
	{
		"locationName": "Panipat",
		"locationCode": ""
	},
	{
		"locationName": "Panna",
		"locationCode": ""
	},
	{
		"locationName": "Panruti",
		"locationCode": ""
	},
	{
		"locationName": "Pansemal",
		"locationCode": ""
	},
	{
		"locationName": "Paonta Sahib",
		"locationCode": ""
	},
	{
		"locationName": "Papanasam",
		"locationCode": ""
	},
	{
		"locationName": "Paradeep",
		"locationCode": ""
	},
	{
		"locationName": "Paralakhemundi",
		"locationCode": ""
	},
	{
		"locationName": "Parappanangadi",
		"locationCode": ""
	},
	{
		"locationName": "Paratwada",
		"locationCode": ""
	},
	{
		"locationName": "Parbhani",
		"locationCode": ""
	},
	{
		"locationName": "Parchur",
		"locationCode": ""
	},
	{
		"locationName": "Parigi (Telangana)",
		"locationCode": ""
	},
	{
		"locationName": "Parkal",
		"locationCode": ""
	},
	{
		"locationName": "Parli",
		"locationCode": ""
	},
	{
		"locationName": "Parvathipuram",
		"locationCode": ""
	},
	{
		"locationName": "Parwanoo",
		"locationCode": ""
	},
	{
		"locationName": "Pasighat",
		"locationCode": ""
	},
	{
		"locationName": "Patan",
		"locationCode": ""
	},
	{
		"locationName": "Patan (CG)",
		"locationCode": ""
	},
	{
		"locationName": "Patan (Satara)",
		"locationCode": ""
	},
	{
		"locationName": "Pathalgaon",
		"locationCode": ""
	},
	{
		"locationName": "Pathanamthitta",
		"locationCode": ""
	},
	{
		"locationName": "Pathanapuram",
		"locationCode": ""
	},
	{
		"locationName": "Pathankot",
		"locationCode": ""
	},
	{
		"locationName": "Pathapatnam",
		"locationCode": ""
	},
	{
		"locationName": "Pathsala",
		"locationCode": ""
	},
	{
		"locationName": "Patiala",
		"locationCode": ""
	},
	{
		"locationName": "Patna",
		"locationCode": ""
	},
	{
		"locationName": "Patran",
		"locationCode": ""
	},
	{
		"locationName": "Patratu",
		"locationCode": ""
	},
	{
		"locationName": "Pattambi",
		"locationCode": ""
	},
	{
		"locationName": "Pattukkottai",
		"locationCode": ""
	},
	{
		"locationName": "Pavagada",
		"locationCode": ""
	},
	{
		"locationName": "Payakaraopeta",
		"locationCode": ""
	},
	{
		"locationName": "Payyanur",
		"locationCode": ""
	},
	{
		"locationName": "Payyoli",
		"locationCode": ""
	},
	{
		"locationName": "Pazhayannur",
		"locationCode": ""
	},
	{
		"locationName": "Pebbair",
		"locationCode": ""
	},
	{
		"locationName": "Pedana",
		"locationCode": ""
	},
	{
		"locationName": "Pedanandipadu",
		"locationCode": ""
	},
	{
		"locationName": "Pedapadu",
		"locationCode": ""
	},
	{
		"locationName": "Peddapalli",
		"locationCode": ""
	},
	{
		"locationName": "Peddapuram",
		"locationCode": ""
	},
	{
		"locationName": "Pen",
		"locationCode": ""
	},
	{
		"locationName": "Pendra",
		"locationCode": ""
	},
	{
		"locationName": "Pennagaram",
		"locationCode": ""
	},
	{
		"locationName": "Penuganchiprolu",
		"locationCode": ""
	},
	{
		"locationName": "Penugonda",
		"locationCode": ""
	},
	{
		"locationName": "Peralam",
		"locationCode": ""
	},
	{
		"locationName": "Perambalur",
		"locationCode": ""
	},
	{
		"locationName": "Peravoor",
		"locationCode": ""
	},
	{
		"locationName": "Peringamala",
		"locationCode": ""
	},
	{
		"locationName": "Peringottukurissi",
		"locationCode": ""
	},
	{
		"locationName": "Perinthalmanna",
		"locationCode": ""
	},
	{
		"locationName": "Periyapatna",
		"locationCode": ""
	},
	{
		"locationName": "Pernambut",
		"locationCode": ""
	},
	{
		"locationName": "Perundurai",
		"locationCode": ""
	},
	{
		"locationName": "Petlad",
		"locationCode": ""
	},
	{
		"locationName": "Phagwara",
		"locationCode": ""
	},
	{
		"locationName": "Phalodi",
		"locationCode": ""
	},
	{
		"locationName": "Phaltan",
		"locationCode": ""
	},
	{
		"locationName": "Phulbani",
		"locationCode": ""
	},
	{
		"locationName": "Piduguralla",
		"locationCode": ""
	},
	{
		"locationName": "Pilani",
		"locationCode": ""
	},
	{
		"locationName": "Pileru",
		"locationCode": ""
	},
	{
		"locationName": "Pilibhit",
		"locationCode": ""
	},
	{
		"locationName": "Pimpalner",
		"locationCode": ""
	},
	{
		"locationName": "Pimpri",
		"locationCode": ""
	},
	{
		"locationName": "Pinjore",
		"locationCode": ""
	},
	{
		"locationName": "Pipariya",
		"locationCode": ""
	},
	{
		"locationName": "Pipraich",
		"locationCode": ""
	},
	{
		"locationName": "Pithampur",
		"locationCode": ""
	},
	{
		"locationName": "Pithapuram",
		"locationCode": ""
	},
	{
		"locationName": "Pithora",
		"locationCode": ""
	},
	{
		"locationName": "Pithoragarh",
		"locationCode": ""
	},
	{
		"locationName": "Pitlam",
		"locationCode": ""
	},
	{
		"locationName": "Pochampally",
		"locationCode": ""
	},
	{
		"locationName": "Podalakur",
		"locationCode": ""
	},
	{
		"locationName": "Podili",
		"locationCode": ""
	},
	{
		"locationName": "Polavaram",
		"locationCode": ""
	},
	{
		"locationName": "Pollachi",
		"locationCode": ""
	},
	{
		"locationName": "Pondicherry",
		"locationCode": ""
	},
	{
		"locationName": "Ponduru",
		"locationCode": ""
	},
	{
		"locationName": "Ponkunnam",
		"locationCode": ""
	},
	{
		"locationName": "Ponnamaravathi",
		"locationCode": ""
	},
	{
		"locationName": "Ponnani",
		"locationCode": ""
	},
	{
		"locationName": "Ponneri",
		"locationCode": ""
	},
	{
		"locationName": "Poovar",
		"locationCode": ""
	},
	{
		"locationName": "Porbandar",
		"locationCode": ""
	},
	{
		"locationName": "Port Blair",
		"locationCode": ""
	},
	{
		"locationName": "Porumamilla",
		"locationCode": ""
	},
	{
		"locationName": "Pratapgarh (Rajasthan)",
		"locationCode": ""
	},
	{
		"locationName": "Pratapgarh (UP)",
		"locationCode": ""
	},
	{
		"locationName": "Prayagraj (Allahabad)",
		"locationCode": ""
	},
	{
		"locationName": "Proddatur",
		"locationCode": ""
	},
	{
		"locationName": "Pudukkottai",
		"locationCode": ""
	},
	{
		"locationName": "Pulgaon",
		"locationCode": ""
	},
	{
		"locationName": "Puliampatti",
		"locationCode": ""
	},
	{
		"locationName": "Pulivendula",
		"locationCode": ""
	},
	{
		"locationName": "Puliyangudi",
		"locationCode": ""
	},
	{
		"locationName": "Pulluvila",
		"locationCode": ""
	},
	{
		"locationName": "Pulpally",
		"locationCode": ""
	},
	{
		"locationName": "Pulwama",
		"locationCode": ""
	},
	{
		"locationName": "Punalur",
		"locationCode": ""
	},
	{
		"locationName": "Punganur",
		"locationCode": ""
	},
	{
		"locationName": "Puri",
		"locationCode": ""
	},
	{
		"locationName": "Purnea",
		"locationCode": ""
	},
	{
		"locationName": "Purulia",
		"locationCode": ""
	},
	{
		"locationName": "Pusad",
		"locationCode": ""
	},
	{
		"locationName": "Pusapatirega",
		"locationCode": ""
	},
	{
		"locationName": "Pushkar",
		"locationCode": ""
	},
	{
		"locationName": "Puthenvelikara",
		"locationCode": ""
	},
	{
		"locationName": "Puthenvelikkara",
		"locationCode": ""
	},
	{
		"locationName": "Puthoor",
		"locationCode": ""
	},
	{
		"locationName": "Puttur (Andhra Pradesh)",
		"locationCode": ""
	},
	{
		"locationName": "Puttur (Karnataka)",
		"locationCode": ""
	},
	{
		"locationName": "Rabkavi Banhatti",
		"locationCode": ""
	},
	{
		"locationName": "Radhamoni",
		"locationCode": ""
	},
	{
		"locationName": "Raebareli",
		"locationCode": ""
	},
	{
		"locationName": "Raghopur",
		"locationCode": ""
	},
	{
		"locationName": "Raghunathganj",
		"locationCode": ""
	},
	{
		"locationName": "Rahata",
		"locationCode": ""
	},
	{
		"locationName": "Rahimatpur",
		"locationCode": ""
	},
	{
		"locationName": "Rahuri",
		"locationCode": ""
	},
	{
		"locationName": "Raibag",
		"locationCode": ""
	},
	{
		"locationName": "Raichur",
		"locationCode": ""
	},
	{
		"locationName": "Raigad",
		"locationCode": ""
	},
	{
		"locationName": "Raiganj",
		"locationCode": ""
	},
	{
		"locationName": "Raigarh",
		"locationCode": ""
	},
	{
		"locationName": "Raikal",
		"locationCode": ""
	},
	{
		"locationName": "Raikot",
		"locationCode": ""
	},
	{
		"locationName": "Railway Koduru",
		"locationCode": ""
	},
	{
		"locationName": "Raipur",
		"locationCode": ""
	},
	{
		"locationName": "Raipuriya",
		"locationCode": ""
	},
	{
		"locationName": "Raisinghnagar",
		"locationCode": ""
	},
	{
		"locationName": "Raja Ka Bagh",
		"locationCode": ""
	},
	{
		"locationName": "Rajakumari",
		"locationCode": ""
	},
	{
		"locationName": "Rajam",
		"locationCode": ""
	},
	{
		"locationName": "Rajamahendravaram (Rajahmundry)",
		"locationCode": ""
	},
	{
		"locationName": "Rajapalayam",
		"locationCode": ""
	},
	{
		"locationName": "Rajapur",
		"locationCode": ""
	},
	{
		"locationName": "Rajarampalli",
		"locationCode": ""
	},
	{
		"locationName": "Rajavommangi",
		"locationCode": ""
	},
	{
		"locationName": "Rajgangpur",
		"locationCode": ""
	},
	{
		"locationName": "Rajgurunagar",
		"locationCode": ""
	},
	{
		"locationName": "Rajiana",
		"locationCode": ""
	},
	{
		"locationName": "Rajkot",
		"locationCode": ""
	},
	{
		"locationName": "Rajnandgaon",
		"locationCode": ""
	},
	{
		"locationName": "Rajpipla",
		"locationCode": ""
	},
	{
		"locationName": "Rajpur",
		"locationCode": ""
	},
	{
		"locationName": "Rajpura",
		"locationCode": ""
	},
	{
		"locationName": "Rajsamand",
		"locationCode": ""
	},
	{
		"locationName": "Rajula",
		"locationCode": ""
	},
	{
		"locationName": "Ramachandrapuram",
		"locationCode": ""
	},
	{
		"locationName": "Ramanagara",
		"locationCode": ""
	},
	{
		"locationName": "Ramanathapuram",
		"locationCode": ""
	},
	{
		"locationName": "Ramayampet",
		"locationCode": ""
	},
	{
		"locationName": "Ramdurg",
		"locationCode": ""
	},
	{
		"locationName": "Rameswarpur",
		"locationCode": ""
	},
	{
		"locationName": "Ramgarh",
		"locationCode": ""
	},
	{
		"locationName": "Ramgarhwa",
		"locationCode": ""
	},
	{
		"locationName": "Ramjibanpur",
		"locationCode": ""
	},
	{
		"locationName": "Ramnagar",
		"locationCode": ""
	},
	{
		"locationName": "Rampachodavaram",
		"locationCode": ""
	},
	{
		"locationName": "Rampur",
		"locationCode": ""
	},
	{
		"locationName": "Ramtek",
		"locationCode": ""
	},
	{
		"locationName": "Ranaghat",
		"locationCode": ""
	},
	{
		"locationName": "Ranastalam",
		"locationCode": ""
	},
	{
		"locationName": "Ranchi",
		"locationCode": ""
	},
	{
		"locationName": "Ranebennur",
		"locationCode": ""
	},
	{
		"locationName": "Rangia",
		"locationCode": ""
	},
	{
		"locationName": "Raniganj",
		"locationCode": ""
	},
	{
		"locationName": "Ranipet",
		"locationCode": ""
	},
	{
		"locationName": "Ranni",
		"locationCode": ""
	},
	{
		"locationName": "Rapur",
		"locationCode": ""
	},
	{
		"locationName": "Rasipuram",
		"locationCode": ""
	},
	{
		"locationName": "Rath",
		"locationCode": ""
	},
	{
		"locationName": "Ratlam",
		"locationCode": ""
	},
	{
		"locationName": "Ratnagiri",
		"locationCode": ""
	},
	{
		"locationName": "Ratnagiri (Odisha)",
		"locationCode": ""
	},
	{
		"locationName": "Ravulapalem",
		"locationCode": ""
	},
	{
		"locationName": "Raxaul",
		"locationCode": ""
	},
	{
		"locationName": "Rayachoti",
		"locationCode": ""
	},
	{
		"locationName": "Rayagada",
		"locationCode": ""
	},
	{
		"locationName": "Rayavaram",
		"locationCode": ""
	},
	{
		"locationName": "Razole",
		"locationCode": ""
	},
	{
		"locationName": "Rentachintala",
		"locationCode": ""
	},
	{
		"locationName": "Renukoot",
		"locationCode": ""
	},
	{
		"locationName": "Repalle",
		"locationCode": ""
	},
	{
		"locationName": "Revdanda",
		"locationCode": ""
	},
	{
		"locationName": "Rewa",
		"locationCode": ""
	},
	{
		"locationName": "Rewari",
		"locationCode": ""
	},
	{
		"locationName": "RiBhoi",
		"locationCode": ""
	},
	{
		"locationName": "Ringas",
		"locationCode": ""
	},
	{
		"locationName": "Rishikesh",
		"locationCode": ""
	},
	{
		"locationName": "Rishra",
		"locationCode": ""
	},
	{
		"locationName": "Robertsganj",
		"locationCode": ""
	},
	{
		"locationName": "Rohtak",
		"locationCode": ""
	},
	{
		"locationName": "Ron",
		"locationCode": ""
	},
	{
		"locationName": "Rongjeng",
		"locationCode": ""
	},
	{
		"locationName": "Roorkee",
		"locationCode": ""
	},
	{
		"locationName": "Rourkela",
		"locationCode": ""
	},
	{
		"locationName": "Routhulapudi",
		"locationCode": ""
	},
	{
		"locationName": "Rudauli",
		"locationCode": ""
	},
	{
		"locationName": "Rudrapur",
		"locationCode": ""
	},
	{
		"locationName": "Rupnagar",
		"locationCode": ""
	},
	{
		"locationName": "Sabbavaram",
		"locationCode": ""
	},
	{
		"locationName": "Sadasivpet",
		"locationCode": ""
	},
	{
		"locationName": "Safidon",
		"locationCode": ""
	},
	{
		"locationName": "Sagar",
		"locationCode": ""
	},
	{
		"locationName": "Sagwara",
		"locationCode": ""
	},
	{
		"locationName": "Saharanpur",
		"locationCode": ""
	},
	{
		"locationName": "Saharsa",
		"locationCode": ""
	},
	{
		"locationName": "Sahjanwa",
		"locationCode": ""
	},
	{
		"locationName": "Sakleshpur",
		"locationCode": ""
	},
	{
		"locationName": "Sakti",
		"locationCode": ""
	},
	{
		"locationName": "Salem",
		"locationCode": ""
	},
	{
		"locationName": "Saligrama",
		"locationCode": ""
	},
	{
		"locationName": "Salihundam",
		"locationCode": ""
	},
	{
		"locationName": "Salur",
		"locationCode": ""
	},
	{
		"locationName": "Samalkota",
		"locationCode": ""
	},
	{
		"locationName": "Samastipur",
		"locationCode": ""
	},
	{
		"locationName": "Sambalpur",
		"locationCode": ""
	},
	{
		"locationName": "Sambhal",
		"locationCode": ""
	},
	{
		"locationName": "Sambhar",
		"locationCode": ""
	},
	{
		"locationName": "Samsi",
		"locationCode": ""
	},
	{
		"locationName": "Sanand",
		"locationCode": ""
	},
	{
		"locationName": "Sanawad",
		"locationCode": ""
	},
	{
		"locationName": "Sangamner",
		"locationCode": ""
	},
	{
		"locationName": "Sangareddy",
		"locationCode": ""
	},
	{
		"locationName": "Sangaria",
		"locationCode": ""
	},
	{
		"locationName": "Sangli",
		"locationCode": ""
	},
	{
		"locationName": "Sangola",
		"locationCode": ""
	},
	{
		"locationName": "Sangrur",
		"locationCode": ""
	},
	{
		"locationName": "Sankarankoil",
		"locationCode": ""
	},
	{
		"locationName": "Sankarapuram",
		"locationCode": ""
	},
	{
		"locationName": "Sankeshwar",
		"locationCode": ""
	},
	{
		"locationName": "Sankri",
		"locationCode": ""
	},
	{
		"locationName": "Santhebennur",
		"locationCode": ""
	},
	{
		"locationName": "Sanwer",
		"locationCode": ""
	},
	{
		"locationName": "Saoner",
		"locationCode": ""
	},
	{
		"locationName": "Saraipali",
		"locationCode": ""
	},
	{
		"locationName": "Sarangarh",
		"locationCode": ""
	},
	{
		"locationName": "Sarangpur",
		"locationCode": ""
	},
	{
		"locationName": "Sarapaka",
		"locationCode": ""
	},
	{
		"locationName": "Sardhana",
		"locationCode": ""
	},
	{
		"locationName": "Sardulgarh",
		"locationCode": ""
	},
	{
		"locationName": "Sarnath",
		"locationCode": ""
	},
	{
		"locationName": "Sarni",
		"locationCode": ""
	},
	{
		"locationName": "Sarsiwa",
		"locationCode": ""
	},
	{
		"locationName": "Sasaram",
		"locationCode": ""
	},
	{
		"locationName": "Satana",
		"locationCode": ""
	},
	{
		"locationName": "Satara",
		"locationCode": ""
	},
	{
		"locationName": "Sathankulam",
		"locationCode": ""
	},
	{
		"locationName": "Sathupally",
		"locationCode": ""
	},
	{
		"locationName": "Sathyamangalam",
		"locationCode": ""
	},
	{
		"locationName": "Satmile",
		"locationCode": ""
	},
	{
		"locationName": "Satna",
		"locationCode": ""
	},
	{
		"locationName": "Sattenapalle",
		"locationCode": ""
	},
	{
		"locationName": "Saundatti",
		"locationCode": ""
	},
	{
		"locationName": "Sawai Madhopur",
		"locationCode": ""
	},
	{
		"locationName": "Sawantwadi",
		"locationCode": ""
	},
	{
		"locationName": "Sayan",
		"locationCode": ""
	},
	{
		"locationName": "Secunderabad",
		"locationCode": ""
	},
	{
		"locationName": "Seethanagaram",
		"locationCode": ""
	},
	{
		"locationName": "Sehmalpur",
		"locationCode": ""
	},
	{
		"locationName": "Sehore",
		"locationCode": ""
	},
	{
		"locationName": "Selu",
		"locationCode": ""
	},
	{
		"locationName": "Semiliguda",
		"locationCode": ""
	},
	{
		"locationName": "Senapati",
		"locationCode": ""
	},
	{
		"locationName": "Sendhwa",
		"locationCode": ""
	},
	{
		"locationName": "Sendurai",
		"locationCode": ""
	},
	{
		"locationName": "Sengottai",
		"locationCode": ""
	},
	{
		"locationName": "Seoni",
		"locationCode": ""
	},
	{
		"locationName": "Seoni Malwa",
		"locationCode": ""
	},
	{
		"locationName": "Serampore",
		"locationCode": ""
	},
	{
		"locationName": "Shadnagar",
		"locationCode": ""
	},
	{
		"locationName": "Shahada",
		"locationCode": ""
	},
	{
		"locationName": "Shahapur",
		"locationCode": ""
	},
	{
		"locationName": "Shahdol",
		"locationCode": ""
	},
	{
		"locationName": "Shahjahanpur",
		"locationCode": ""
	},
	{
		"locationName": "Shahpur",
		"locationCode": ""
	},
	{
		"locationName": "Shahpura",
		"locationCode": ""
	},
	{
		"locationName": "Shajapur",
		"locationCode": ""
	},
	{
		"locationName": "Shamgarh",
		"locationCode": ""
	},
	{
		"locationName": "Shankarampet",
		"locationCode": ""
	},
	{
		"locationName": "Shankarpally",
		"locationCode": ""
	},
	{
		"locationName": "Shankarpur",
		"locationCode": ""
	},
	{
		"locationName": "Shela",
		"locationCode": ""
	},
	{
		"locationName": "Sheopur",
		"locationCode": ""
	},
	{
		"locationName": "Sheorinarayan",
		"locationCode": ""
	},
	{
		"locationName": "Shikaripur",
		"locationCode": ""
	},
	{
		"locationName": "Shikarpur",
		"locationCode": ""
	},
	{
		"locationName": "Shikrapur",
		"locationCode": ""
	},
	{
		"locationName": "Shillong",
		"locationCode": ""
	},
	{
		"locationName": "Shimla",
		"locationCode": ""
	},
	{
		"locationName": "Shindkheda",
		"locationCode": ""
	},
	{
		"locationName": "Shirahatti",
		"locationCode": ""
	},
	{
		"locationName": "Shirali",
		"locationCode": ""
	},
	{
		"locationName": "Shirpur",
		"locationCode": ""
	},
	{
		"locationName": "Shirur",
		"locationCode": ""
	},
	{
		"locationName": "Shivamogga",
		"locationCode": ""
	},
	{
		"locationName": "Shivpuri",
		"locationCode": ""
	},
	{
		"locationName": "Shopian",
		"locationCode": ""
	},
	{
		"locationName": "Shoranur",
		"locationCode": ""
	},
	{
		"locationName": "Shrigonda",
		"locationCode": ""
	},
	{
		"locationName": "Shrirampur",
		"locationCode": ""
	},
	{
		"locationName": "Shujalpur",
		"locationCode": ""
	},
	{
		"locationName": "Shuklaganj",
		"locationCode": ""
	},
	{
		"locationName": "Siddharthnagar",
		"locationCode": ""
	},
	{
		"locationName": "Siddhpur",
		"locationCode": ""
	},
	{
		"locationName": "Siddipet",
		"locationCode": ""
	},
	{
		"locationName": "Sidlaghatta",
		"locationCode": ""
	},
	{
		"locationName": "Sihora",
		"locationCode": ""
	},
	{
		"locationName": "Sikar",
		"locationCode": ""
	},
	{
		"locationName": "Silchar",
		"locationCode": ""
	},
	{
		"locationName": "Siliguri",
		"locationCode": ""
	},
	{
		"locationName": "Silvassa",
		"locationCode": ""
	},
	{
		"locationName": "Sindhanur",
		"locationCode": ""
	},
	{
		"locationName": "Sindhudurg",
		"locationCode": ""
	},
	{
		"locationName": "Singapore",
		"locationCode": ""
	},
	{
		"locationName": "Singarayakonda",
		"locationCode": ""
	},
	{
		"locationName": "Singrauli",
		"locationCode": ""
	},
	{
		"locationName": "Sinnar",
		"locationCode": ""
	},
	{
		"locationName": "Sira",
		"locationCode": ""
	},
	{
		"locationName": "Sircilla",
		"locationCode": ""
	},
	{
		"locationName": "Sirmaur",
		"locationCode": ""
	},
	{
		"locationName": "Sirohi",
		"locationCode": ""
	},
	{
		"locationName": "Sirsa",
		"locationCode": ""
	},
	{
		"locationName": "Sirsi",
		"locationCode": ""
	},
	{
		"locationName": "Siruguppa",
		"locationCode": ""
	},
	{
		"locationName": "Sitamarhi",
		"locationCode": ""
	},
	{
		"locationName": "Sitapur",
		"locationCode": ""
	},
	{
		"locationName": "Sivaganga",
		"locationCode": ""
	},
	{
		"locationName": "Sivakasi",
		"locationCode": ""
	},
	{
		"locationName": "Sivasagar",
		"locationCode": ""
	},
	{
		"locationName": "Siwan",
		"locationCode": ""
	},
	{
		"locationName": "Solan",
		"locationCode": ""
	},
	{
		"locationName": "Solapur",
		"locationCode": ""
	},
	{
		"locationName": "Solukhumbu",
		"locationCode": ""
	},
	{
		"locationName": "Sompeta",
		"locationCode": ""
	},
	{
		"locationName": "Sonari",
		"locationCode": ""
	},
	{
		"locationName": "Songadh",
		"locationCode": ""
	},
	{
		"locationName": "Sonipat",
		"locationCode": ""
	},
	{
		"locationName": "Sonkatch",
		"locationCode": ""
	},
	{
		"locationName": "Soron",
		"locationCode": ""
	},
	{
		"locationName": "South 24 Parganas",
		"locationCode": ""
	},
	{
		"locationName": "Sri Ganganagar",
		"locationCode": ""
	},
	{
		"locationName": "Sri Sathya Sai",
		"locationCode": ""
	},
	{
		"locationName": "Srikakulam",
		"locationCode": ""
	},
	{
		"locationName": "Srinagar",
		"locationCode": ""
	},
	{
		"locationName": "Srirangapatna",
		"locationCode": ""
	},
	{
		"locationName": "Srivaikuntam",
		"locationCode": ""
	},
	{
		"locationName": "Srivilliputhur",
		"locationCode": ""
	},
	{
		"locationName": "Station Ghanpur",
		"locationCode": ""
	},
	{
		"locationName": "Sugauli",
		"locationCode": ""
	},
	{
		"locationName": "Sujangarh",
		"locationCode": ""
	},
	{
		"locationName": "Sukma",
		"locationCode": ""
	},
	{
		"locationName": "Sultanabad",
		"locationCode": ""
	},
	{
		"locationName": "Sultanpur",
		"locationCode": ""
	},
	{
		"locationName": "Sulthan Bathery",
		"locationCode": ""
	},
	{
		"locationName": "Sumerpur",
		"locationCode": ""
	},
	{
		"locationName": "Sundar Nagar",
		"locationCode": ""
	},
	{
		"locationName": "Sundargarh",
		"locationCode": ""
	},
	{
		"locationName": "Supaul",
		"locationCode": ""
	},
	{
		"locationName": "Surajpur",
		"locationCode": ""
	},
	{
		"locationName": "Surat",
		"locationCode": ""
	},
	{
		"locationName": "Surathkal",
		"locationCode": ""
	},
	{
		"locationName": "Surendranagar",
		"locationCode": ""
	},
	{
		"locationName": "Suri",
		"locationCode": ""
	},
	{
		"locationName": "Suryapet",
		"locationCode": ""
	},
	{
		"locationName": "T.Narasapuram",
		"locationCode": ""
	},
	{
		"locationName": "Tadepalligudem",
		"locationCode": ""
	},
	{
		"locationName": "Tadikalapudi",
		"locationCode": ""
	},
	{
		"locationName": "Tadipatri",
		"locationCode": ""
	},
	{
		"locationName": "Talcher",
		"locationCode": ""
	},
	{
		"locationName": "Taliparamba",
		"locationCode": ""
	},
	{
		"locationName": "Tallapudi",
		"locationCode": ""
	},
	{
		"locationName": "Tallarevu",
		"locationCode": ""
	},
	{
		"locationName": "Talwandi Bhai",
		"locationCode": ""
	},
	{
		"locationName": "Tamluk",
		"locationCode": ""
	},
	{
		"locationName": "Tanda",
		"locationCode": ""
	},
	{
		"locationName": "Tandur",
		"locationCode": ""
	},
	{
		"locationName": "Tangla",
		"locationCode": ""
	},
	{
		"locationName": "Tangutur",
		"locationCode": ""
	},
	{
		"locationName": "Tanuku",
		"locationCode": ""
	},
	{
		"locationName": "Tarapur",
		"locationCode": ""
	},
	{
		"locationName": "Tarikere",
		"locationCode": ""
	},
	{
		"locationName": "Tasgaon",
		"locationCode": ""
	},
	{
		"locationName": "Tatipaka",
		"locationCode": ""
	},
	{
		"locationName": "Tawang",
		"locationCode": ""
	},
	{
		"locationName": "Tekkali",
		"locationCode": ""
	},
	{
		"locationName": "Tembhurni",
		"locationCode": ""
	},
	{
		"locationName": "Tenali",
		"locationCode": ""
	},
	{
		"locationName": "Tenkasi",
		"locationCode": ""
	},
	{
		"locationName": "Terdal",
		"locationCode": ""
	},
	{
		"locationName": "Tezpur",
		"locationCode": ""
	},
	{
		"locationName": "Tezu",
		"locationCode": ""
	},
	{
		"locationName": "Thalassery",
		"locationCode": ""
	},
	{
		"locationName": "Thalayolaparambu",
		"locationCode": ""
	},
	{
		"locationName": "Thalikulam",
		"locationCode": ""
	},
	{
		"locationName": "Thallada",
		"locationCode": ""
	},
	{
		"locationName": "Thamarassery",
		"locationCode": ""
	},
	{
		"locationName": "Thanipadi",
		"locationCode": ""
	},
	{
		"locationName": "Thanjavur",
		"locationCode": ""
	},
	{
		"locationName": "Tharad",
		"locationCode": ""
	},
	{
		"locationName": "Theni",
		"locationCode": ""
	},
	{
		"locationName": "Thimmapuram (Addu Road)",
		"locationCode": ""
	},
	{
		"locationName": "Thirubuvanai",
		"locationCode": ""
	},
	{
		"locationName": "Thirumalagiri",
		"locationCode": ""
	},
	{
		"locationName": "Thiruthuraipoondi",
		"locationCode": ""
	},
	{
		"locationName": "Thiruttani",
		"locationCode": ""
	},
	{
		"locationName": "Thiruvalla",
		"locationCode": ""
	},
	{
		"locationName": "Thiruvarur",
		"locationCode": ""
	},
	{
		"locationName": "Thodupuzha",
		"locationCode": ""
	},
	{
		"locationName": "Thoothukudi",
		"locationCode": ""
	},
	{
		"locationName": "Thorrur",
		"locationCode": ""
	},
	{
		"locationName": "Thottiyam",
		"locationCode": ""
	},
	{
		"locationName": "Thriprayar",
		"locationCode": ""
	},
	{
		"locationName": "Thrissur",
		"locationCode": ""
	},
	{
		"locationName": "Thullur",
		"locationCode": ""
	},
	{
		"locationName": "Thuraiyur",
		"locationCode": ""
	},
	{
		"locationName": "Tilda Neora",
		"locationCode": ""
	},
	{
		"locationName": "Tindivanam",
		"locationCode": ""
	},
	{
		"locationName": "Tinsukia",
		"locationCode": ""
	},
	{
		"locationName": "Tiptur",
		"locationCode": ""
	},
	{
		"locationName": "Tiruchendur",
		"locationCode": ""
	},
	{
		"locationName": "Tirukoilur",
		"locationCode": ""
	},
	{
		"locationName": "Tirumakudalu Narasipura",
		"locationCode": ""
	},
	{
		"locationName": "Tirunelveli",
		"locationCode": ""
	},
	{
		"locationName": "Tirupati",
		"locationCode": ""
	},
	{
		"locationName": "Tirupattur",
		"locationCode": ""
	},
	{
		"locationName": "Tirupur",
		"locationCode": ""
	},
	{
		"locationName": "Tirur",
		"locationCode": ""
	},
	{
		"locationName": "Tiruvallur",
		"locationCode": ""
	},
	{
		"locationName": "Tiruvannamalai",
		"locationCode": ""
	},
	{
		"locationName": "Tiruvarur",
		"locationCode": ""
	},
	{
		"locationName": "Tiruvuru",
		"locationCode": ""
	},
	{
		"locationName": "Titagarh",
		"locationCode": ""
	},
	{
		"locationName": "Titlagarh",
		"locationCode": ""
	},
	{
		"locationName": "Tittakudi",
		"locationCode": ""
	},
	{
		"locationName": "Tonk",
		"locationCode": ""
	},
	{
		"locationName": "Toopran",
		"locationCode": ""
	},
	{
		"locationName": "Trichy",
		"locationCode": ""
	},
	{
		"locationName": "Trivandrum",
		"locationCode": ""
	},
	{
		"locationName": "Tumakuru (Tumkur)",
		"locationCode": ""
	},
	{
		"locationName": "Tumsar",
		"locationCode": ""
	},
	{
		"locationName": "Tura",
		"locationCode": ""
	},
	{
		"locationName": "Turputallu",
		"locationCode": ""
	},
	{
		"locationName": "Turuvekere",
		"locationCode": ""
	},
	{
		"locationName": "Udaipur",
		"locationCode": ""
	},
	{
		"locationName": "Udaynarayanpur",
		"locationCode": ""
	},
	{
		"locationName": "Udgir",
		"locationCode": ""
	},
	{
		"locationName": "Udhampur",
		"locationCode": ""
	},
	{
		"locationName": "Udumalpet",
		"locationCode": ""
	},
	{
		"locationName": "Udupi",
		"locationCode": ""
	},
	{
		"locationName": "Ujhani",
		"locationCode": ""
	},
	{
		"locationName": "Ujjain",
		"locationCode": ""
	},
	{
		"locationName": "Ulikkal",
		"locationCode": ""
	},
	{
		"locationName": "Uluberia",
		"locationCode": ""
	},
	{
		"locationName": "Ulundurpet",
		"locationCode": ""
	},
	{
		"locationName": "Umaria",
		"locationCode": ""
	},
	{
		"locationName": "Umbergaon",
		"locationCode": ""
	},
	{
		"locationName": "Umbraj",
		"locationCode": ""
	},
	{
		"locationName": "Umerkote",
		"locationCode": ""
	},
	{
		"locationName": "Umred",
		"locationCode": ""
	},
	{
		"locationName": "Una",
		"locationCode": ""
	},
	{
		"locationName": "Una (Gujarat)",
		"locationCode": ""
	},
	{
		"locationName": "Undavalli",
		"locationCode": ""
	},
	{
		"locationName": "Unnao",
		"locationCode": ""
	},
	{
		"locationName": "Uppada",
		"locationCode": ""
	},
	{
		"locationName": "Uthamapalayam",
		"locationCode": ""
	},
	{
		"locationName": "Uthangarai",
		"locationCode": ""
	},
	{
		"locationName": "Uthiramerur",
		"locationCode": ""
	},
	{
		"locationName": "Uthukottai",
		"locationCode": ""
	},
	{
		"locationName": "Utraula",
		"locationCode": ""
	},
	{
		"locationName": "Uttara Kannada",
		"locationCode": ""
	},
	{
		"locationName": "Uttarkashi",
		"locationCode": ""
	},
	{
		"locationName": "Vadakara",
		"locationCode": ""
	},
	{
		"locationName": "Vadakkencherry",
		"locationCode": ""
	},
	{
		"locationName": "Vadalur",
		"locationCode": ""
	},
	{
		"locationName": "Vadanappally",
		"locationCode": ""
	},
	{
		"locationName": "Vadodara",
		"locationCode": ""
	},
	{
		"locationName": "Vaduj",
		"locationCode": ""
	},
	{
		"locationName": "Vaijapur",
		"locationCode": ""
	},
	{
		"locationName": "Valaparla",
		"locationCode": ""
	},
	{
		"locationName": "Valigonda",
		"locationCode": ""
	},
	{
		"locationName": "Valluru",
		"locationCode": ""
	},
	{
		"locationName": "Valsad",
		"locationCode": ""
	},
	{
		"locationName": "Vaniyambadi",
		"locationCode": ""
	},
	{
		"locationName": "Vapi",
		"locationCode": ""
	},
	{
		"locationName": "Varadaiahpalem",
		"locationCode": ""
	},
	{
		"locationName": "Varadiyam",
		"locationCode": ""
	},
	{
		"locationName": "Varanasi",
		"locationCode": ""
	},
	{
		"locationName": "Varkala",
		"locationCode": ""
	},
	{
		"locationName": "Vasind",
		"locationCode": ""
	},
	{
		"locationName": "Vatsavai",
		"locationCode": ""
	},
	{
		"locationName": "Vazhapadi",
		"locationCode": ""
	},
	{
		"locationName": "Vedasandur",
		"locationCode": ""
	},
	{
		"locationName": "Veeraghattam",
		"locationCode": ""
	},
	{
		"locationName": "Velangi",
		"locationCode": ""
	},
	{
		"locationName": "Velanja",
		"locationCode": ""
	},
	{
		"locationName": "Velanthavalam",
		"locationCode": ""
	},
	{
		"locationName": "Vellakoil",
		"locationCode": ""
	},
	{
		"locationName": "Vellampalli",
		"locationCode": ""
	},
	{
		"locationName": "Vellore",
		"locationCode": ""
	},
	{
		"locationName": "Velugodu",
		"locationCode": ""
	},
	{
		"locationName": "Vempalli",
		"locationCode": ""
	},
	{
		"locationName": "Vemulawada",
		"locationCode": ""
	},
	{
		"locationName": "Vengurla",
		"locationCode": ""
	},
	{
		"locationName": "Venkatapuram",
		"locationCode": ""
	},
	{
		"locationName": "Veraval",
		"locationCode": ""
	},
	{
		"locationName": "Vetapalem",
		"locationCode": ""
	},
	{
		"locationName": "Vettaikaranpudur",
		"locationCode": ""
	},
	{
		"locationName": "Vettavalam",
		"locationCode": ""
	},
	{
		"locationName": "Vidisha",
		"locationCode": ""
	},
	{
		"locationName": "Vijapur",
		"locationCode": ""
	},
	{
		"locationName": "Vijayapura (Bengaluru Rural)",
		"locationCode": ""
	},
	{
		"locationName": "Vijayapura (Bijapur)",
		"locationCode": ""
	},
	{
		"locationName": "Vijayarai",
		"locationCode": ""
	},
	{
		"locationName": "Vijayawada",
		"locationCode": ""
	},
	{
		"locationName": "Vikarabad",
		"locationCode": ""
	},
	{
		"locationName": "Vikasnagar",
		"locationCode": ""
	},
	{
		"locationName": "Vikravandi",
		"locationCode": ""
	},
	{
		"locationName": "Villupuram",
		"locationCode": ""
	},
	{
		"locationName": "Vinukonda",
		"locationCode": ""
	},
	{
		"locationName": "Viralimalai",
		"locationCode": ""
	},
	{
		"locationName": "Virudhachalam",
		"locationCode": ""
	},
	{
		"locationName": "Virudhunagar",
		"locationCode": ""
	},
	{
		"locationName": "Visnagar",
		"locationCode": ""
	},
	{
		"locationName": "Vissannapeta",
		"locationCode": ""
	},
	{
		"locationName": "Vita",
		"locationCode": ""
	},
	{
		"locationName": "Vithlapur",
		"locationCode": ""
	},
	{
		"locationName": "Vizag (Visakhapatnam)",
		"locationCode": ""
	},
	{
		"locationName": "Vizianagaram",
		"locationCode": ""
	},
	{
		"locationName": "Vrindavan",
		"locationCode": ""
	},
	{
		"locationName": "Vuyyuru",
		"locationCode": ""
	},
	{
		"locationName": "Vyara",
		"locationCode": ""
	},
	{
		"locationName": "Wadakkancherry",
		"locationCode": ""
	},
	{
		"locationName": "Wai",
		"locationCode": ""
	},
	{
		"locationName": "Waluj",
		"locationCode": ""
	},
	{
		"locationName": "Wanaparthy",
		"locationCode": ""
	},
	{
		"locationName": "Wani",
		"locationCode": ""
	},
	{
		"locationName": "Warangal",
		"locationCode": ""
	},
	{
		"locationName": "Wardha",
		"locationCode": ""
	},
	{
		"locationName": "Warora",
		"locationCode": ""
	},
	{
		"locationName": "Washim",
		"locationCode": ""
	},
	{
		"locationName": "Wayanad",
		"locationCode": ""
	},
	{
		"locationName": "West Kameng",
		"locationCode": ""
	},
	{
		"locationName": "Wyra",
		"locationCode": ""
	},
	{
		"locationName": "Yadagirigutta",
		"locationCode": ""
	},
	{
		"locationName": "Yamunanagar",
		"locationCode": ""
	},
	{
		"locationName": "Yanam",
		"locationCode": ""
	},
	{
		"locationName": "Yangon",
		"locationCode": ""
	},
	{
		"locationName": "Yavatmal",
		"locationCode": ""
	},
	{
		"locationName": "Yelagiri",
		"locationCode": ""
	},
	{
		"locationName": "Yelburga",
		"locationCode": ""
	},
	{
		"locationName": "Yeleswaram",
		"locationCode": ""
	},
	{
		"locationName": "Yellamanchili",
		"locationCode": ""
	},
	{
		"locationName": "Yellandu",
		"locationCode": ""
	},
	{
		"locationName": "Yellareddy",
		"locationCode": ""
	},
	{
		"locationName": "Yellareddypet",
		"locationCode": ""
	},
	{
		"locationName": "Yemmiganur",
		"locationCode": ""
	},
	{
		"locationName": "Yeola",
		"locationCode": ""
	},
	{
		"locationName": "Yerragondapalem",
		"locationCode": ""
	},
	{
		"locationName": "Yerraguntla",
		"locationCode": ""
	},
	{
		"locationName": "Yewat",
		"locationCode": ""
	},
	{
		"locationName": "Yuksom",
		"locationCode": ""
	},
	{
		"locationName": "Zaheerabad",
		"locationCode": ""
	},
	{
		"locationName": "Zarap",
		"locationCode": ""
	},
	{
		"locationName": "Ziro",
		"locationCode": ""
	},
	{
		"locationName": "Mumbai",
		"locationCode": ""
	},
	{
		"locationName": "Delhi-NCR",
		"locationCode": ""
	},
	{
		"locationName": "Bengaluru",
		"locationCode": ""
	},
	{
		"locationName": "Hyderabad",
		"locationCode": ""
	},
	{
		"locationName": "Chandigarh",
		"locationCode": ""
	},
	{
		"locationName": "Ahmedabad",
		"locationCode": ""
	},
	{
		"locationName": "Chennai",
		"locationCode": ""
	},
	{
		"locationName": "Pune",
		"locationCode": ""
	},
	{
		"locationName": "Kolkata",
		"locationCode": ""
	},
	{
		"locationName": "Kochi",
		"locationCode": ""
	}
];




const findClosestCity = (city, indianCities) => {
	var citywords = city.split(" ");
	var citywords = citywords.filter(word => word.length > 2); // Filter out words with length <= 2
	for (var i = 0; i < citywords.length; i++) {
		citywords[i] = citywords[i].replace(/[^a-zA-Z]/g, ""); // Remove special characters
		citywords[i] = citywords[i].replace(/_/g, " "); // Replace underscores with spaces
		citywords[i] = citywords[i].replace(/-/g, " "); // Replace hyphens with spaces
		citywords[i] = citywords[i].replace(/\s+/g, " "); // Replace multiple spaces with a single space
		citywords[i] = citywords[i].replace(/,/g, " "); // Replace commas with spaces

		citywords[i] = citywords[i].charAt(0).toUpperCase() + citywords[i].slice(1);
		citywords[i] = citywords[i].trim(); // Trim leading and trailing spaces
		// console.log("Finding closest city for:", citywords[i]);
		var indianCitiesLocationName = indianCities.map(city => city.locationName);
		const fuse = new Fuse(indianCitiesLocationName, { threshold: 0.1 });

		const result = fuse.search(citywords[i]);
		// console.log("Search result:", result);
		if (result.length > 0) {
			// console.log("Search result:", result);
			return result.length > 0 ? result[0].item : "Unknown City";
		}

	}
	return city;


};
function LocationBlock({ fetchEvents, indianCities }) {
	const [location, setLocation] = useState("Fetching location...");
	const [customLocation, setCustomLocation] = useState("");
	const [suggestions, setSuggestions] = useState([]);

	useEffect(() => {

		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				(position) => {
					fetch(
						`https://nominatim.openstreetmap.org/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}&format=json`
					)
						.then((res) => res.json())
						.then((data) => {
							// console.log(data);
							if (!data || !data.address) {
								setLocation("Location unavailable");
								return;
							}
							const city = data.address.state_district || data.address.state || data.address.county || "Unknown City";
							// console.log(city);
							var indianCityLocationName = indianCities.map(city => city.locationName);
							console.log("Indian city location names:", indianCityLocationName);
							const matchedCity = findClosestCity(city, indianCityLocationName);
							console.log("Matched city:", matchedCity);
							var cityObj = indianCities.find(city => city.locationName === matchedCity);
							console.log("City object:", cityObj);
							setLocation(matchedCity);
							if (matchedCity !== location) {
								fetchEvents(cityObj);
							}
						})
						.catch(() => setLocation("Location unavailable"));
				},
				() => {
					setLocation("Location permission denied")
				}
			);
		} else {
			setLocation("Geolocation not supported");
		}
	}, []);

	const fetchLocations = (query) => {
		if (query.length > 2) {
			const filteredCities = indianCities.filter(city => city.locationName.toLowerCase().includes(query.toLowerCase()));
			setSuggestions(filteredCities);
		} else {
			setSuggestions([]);
		}
	};

	return (
		<div className="d-flex flex-column align-items-end gap-2">
			<div className="d-flex align-items-center gap-2">
				<FontAwesomeIcon icon={faMapMarkerAlt} className="text-primary" />
				<span className="text-muted">{location}</span>
			</div>
			<div className="position-relative">
				<input
					type="text"
					className="form-control"
					placeholder="Enter location"
					value={customLocation}
					onChange={(e) => {
						setCustomLocation(e.target.value);
						fetchLocations(e.target.value);
					}}
				/>
				{suggestions.length > 0 && (
					<ul className="list-group position-absolute w-100 mt-1" style={{ zIndex: 10 }}>
						{suggestions.map((city, index) => (
							<li
								key={index}
								className="list-group-item list-group-item-action"
								onClick={() => {
									setLocation(city.locationName);
									fetchEvents(city);
									setCustomLocation("");
									setSuggestions([]);
								}}
							>
								{city.locationName}
							</li>
						))}
					</ul>
				)}
			</div>
		</div>
	);
}
const FestivalsEvents = () => {
	const [visibleCount, setVisibleCount] = useState(window.innerWidth < 550 ? 6 : 12);
	const [selectedFilter, setSelectedFilter] = useState(null);
	const [currentLocation, setCurrentLocation] = useState(null);
	const [events, setEvents] = useState([]);
	const [indianCities, setIndianCities] = useState(indianCitiesPageData);


	useEffect(() => {
		const fetchCities = async () => {
			try {
				const response = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/events/getLocationNamesWithCode`); // Replace with your API endpoint
				const data = await response.json();
				// var arrayOfLocationName = data.map((item) => item.locationName);
				// for indiancitites each add correcponsign locationCode to lcoationName 
				const updatedCities = indianCities.map((city) => {
					const matchedData = data.find((d) =>
						city.locationName.toLowerCase().includes(d.locationName.toLowerCase())
					);

					if (matchedData) {
						return {
							...city,
							locationCode: matchedData.locationCode,
						};
					}
					return city;
				});
				console.log("Updated cities:", updatedCities);

				setIndianCities(updatedCities);
			} catch (error) {
				console.error('Error fetching cities:', error);
			}
		};
		fetchCities();
	}, []);
	const fetchEvents = async (city) => {
		// const encodedCity = encodeURIComponent(city);
		console.log("Fetching events for city:", city);

		const res = await fetch(
			`${process.env.REACT_APP_BACKEND_BASE_URL}/api/events/getEventsForLocation`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ locationName: city.locationName.split("-")[0], locationCode: city.locationCode ? city.locationCode : "" }),
			}
		);
		const data = await res.json();
		console.log("Events data:", data.events);

		setEvents(data.events || []);
	};


	const handleShowMore = () => {
		setVisibleCount(events.length); // Show all locations
	};



	return (
		<section className="">
			<div className='row'>
				<div className='col-lg-8 col-sm-12 col-md-8'>
					<h2 className="fw-bold majorHeadings" style={{ textAlign: "left" }}>Festivals & Events</h2>
					{/* Filters */}
					{/* <div className="mt-3">
                        {Object.keys(eventCategories).map((category) => (
                            <button
                                key={category}
                                className={`btn ${selectedFilter === category ? 'btn-primary' : 'btn-outline-primary'} me-2 mb-2`}
                                onClick={() => handleFilterChange(category)}
                            >
                                {category}
                            </button>
                        ))}
                    </div> */}
				</div>

				<div className='col-lg-4 col-sm-12 col-md-4'>
					{indianCities.length > 0 && (
						<LocationBlock fetchEvents={fetchEvents} indianCities={indianCities} />
					)}
					{/* <LocationBlock fetchEvents={fetchEvents} indianCities={indianCities} /> */}
				</div>
			</div>

			{/* Display Events or Locations */}
			<div className='col-lg-12'
				style={{
					display: "flex",
					justifyContent: "space-around",
					flexWrap: "wrap"
				}}
			>

				{events.length > 0 ? (
					<EventList events={events.slice(0, visibleCount)} />
				) : (
					<EmptyState />
				)}
			</div>

			{visibleCount < events.length && events.length > 0 && (
				<div style={{ textAlign: 'center', margin: '20px 0' }}>
					<button className="btn btn-black" onClick={handleShowMore}>
						Show More
					</button>
				</div>
			)}
		</section>
	);
};
export default FestivalsEvents;