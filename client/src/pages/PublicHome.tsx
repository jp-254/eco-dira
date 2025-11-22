// client/src/pages/PublicHome.tsx
import { Link } from "react-router-dom";

export default function PublicHome() {
	return (
		<div
			className="min-h-screen bg-cover bg-center bg-no-repeat bg-fixed"
			style={{ backgroundImage: "url('/images/hero-recycling-kenya.jpg')" }}
		>
			{/* Overlay for better readability */}
			<div className="min-h-screen">
				<div className="space-y-12 p-6 max-w-4xl mx-auto">
					<header className="text-center py-12">
						<h1 className="text-4xl font-bold">ECO DIRA ♻️🌍</h1>
						<p className="mt-3 text-blue-600">
							Recycling education & rewards for Kenyan homes. Eco Dira — promoting
							recycling and sustainable waste management across Kenya. Recycle
							Today, Sustain Tomorrow ♻🙂‍↕
						</p>
						<div className="mt-6 space-x-3">
							<Link
								to="/register"
								className="px-4 py-2 bg-green-700 text-white rounded">
								Join the movement
							</Link>
							<a href="#contact" className="px-4 py-2 border rounded">
								Contact us
							</a>
						</div>
					</header>

					<section id="about" className="bg-white p-6 rounded shadow">
						<h2 className="text-2xl font-semibold mb-2">About ECO DIRA</h2>
						<p className="text-gray-700">
							ECO DIRA empowers Kenyan communities to recycle by rewarding
							households for recyclable materials collected. We partner with local
							prop-tech providers and collectors to track collections and rewards.
						</p>
					</section>

					<section id="services" className="bg-white p-6 rounded shadow">
						<h2 className="text-2xl font-semibold mb-2">Services</h2>
						<ul className="list-disc pl-5 text-gray-700">
							<li>Household recyclable pickups (schedule & track)</li>
							<li>Points & rewards system</li>
							<li>Community training programs</li>
							<li>Reports & analytics for communities</li>
						</ul>
					</section>

					<section id="register" className="bg-white p-6 rounded shadow">
						<h2 className="text-2xl font-semibold mb-2">Register</h2>
						<p className="text-gray-700">
							Quick sign up — get rewarded when your recyclables are collected.
						</p>
						<Link
							to="/register"
							className="inline-block mt-3 px-4 py-2 bg-blue-600 text-white rounded">
							Register now
						</Link>
					</section>

					<section id="contact" className="bg-white p-6 rounded shadow">
						<h2 className="text-2xl font-semibold mb-2">Contact & Social</h2>
						<p className="text-gray-700">Email: hello@ecodira.org</p>
						<p className="text-gray-700">Phone Number: +254799263373</p>
						<div className="mt-3 space-x-3">
							<a
								href="https://facebook.com"
								target="_blank"
								rel="noopener noreferrer"
								className="underline">
								Facebook
							</a>
							<a
								href="https://instagram.com"
								target="_blank"
								rel="noopener noreferrer"
								className="underline">
								Instagram
							</a>
							<a
								href="https://twitter.com"
								target="_blank"
								rel="noopener noreferrer"
								className="underline">
								Twitter
							</a>
						</div>
					</section>
				</div>
			</div>
		</div>
	);
}