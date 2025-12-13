import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { ListingsGrid, type UIItemListing } from './index.tsx';

import airpodsImg from '../../assets/item-images/airpods.png';
import armchairImg from '../../assets/item-images/armchair.png';
import backpackImg from '../../assets/item-images/backpack.png';
import bikeImg from '../../assets/item-images/bike.png';
import bubbleChairImg from '../../assets/item-images/bubble-chair.png';
import deskLampImg from '../../assets/item-images/desk-lamp.png';
import fanImg from '../../assets/item-images/fan.png';
import hammockImg from '../../assets/item-images/hammock.png';
import projectorImg from '../../assets/item-images/projector.png';
import sewingMachineImg from '../../assets/item-images/sewing-machine.png';
import tentImg from '../../assets/item-images/tent.png';
import umbrellaImg from '../../assets/item-images/umbrella.png';

const DUMMY_LISTINGS: UIItemListing[] = [
	{
		id: '1',
		title: 'City Bike',
		description:
			'Perfect city bike for commuting and leisure rides around the neighborhood.',
		category: 'Vehicles & Transportation',
		location: 'Philadelphia, PA',
		sharingPeriodStart: new Date('2024-08-11'),
		sharingPeriodEnd: new Date('2024-12-23'),
		state: 'Active',
		images: [bikeImg],
		createdAt: new Date('2024-08-01'),
		updatedAt: new Date('2024-08-01'),
	},
	{
		id: '2',
		title: 'Cordless Drill',
		description:
			'Professional grade cordless drill with multiple attachments. Perfect for home improvement projects.',
		category: 'Tools & Equipment',
		location: 'Philadelphia, PA',
		sharingPeriodStart: new Date('2024-08-11'),
		sharingPeriodEnd: new Date('2024-12-23'),
		state: 'Active',
		images: [projectorImg],
		createdAt: new Date('2024-08-02'),
		updatedAt: new Date('2024-08-02'),
	},
	{
		id: '3',
		title: 'Hand Mixer',
		description:
			'Electric hand mixer with multiple speed settings. Great for baking and cooking.',
		category: 'Home & Garden',
		location: 'Philadelphia, PA',
		sharingPeriodStart: new Date('2024-08-11'),
		sharingPeriodEnd: new Date('2024-12-23'),
		state: 'Active',
		images: [sewingMachineImg],
		createdAt: new Date('2024-08-03'),
		updatedAt: new Date('2024-08-03'),
	},
	{
		id: '4',
		title: 'Golf Clubs',
		description:
			'Complete set of golf clubs including driver, irons, and putter. Perfect for beginners.',
		category: 'Sports & Outdoors',
		location: 'Philadelphia, PA',
		sharingPeriodStart: new Date('2024-08-11'),
		sharingPeriodEnd: new Date('2024-12-23'),
		state: 'Active',
		images: [backpackImg],
		createdAt: new Date('2024-08-04'),
		updatedAt: new Date('2024-08-04'),
	},
	{
		id: '5',
		title: 'Beach Gear',
		description:
			'Beach umbrella, chairs, and accessories for a perfect day at the beach.',
		category: 'Sports & Outdoors',
		location: 'Philadelphia, PA',
		sharingPeriodStart: new Date('2024-08-11'),
		sharingPeriodEnd: new Date('2024-12-23'),
		state: 'Active',
		images: [umbrellaImg],
		createdAt: new Date('2024-08-05'),
		updatedAt: new Date('2024-08-05'),
	},
	{
		id: '6',
		title: 'AirPods Pro',
		description:
			'Noise-cancelling wireless earbuds with spatial audio. Perfect for music and calls.',
		category: 'Electronics',
		location: 'Philadelphia, PA',
		sharingPeriodStart: new Date('2024-08-11'),
		sharingPeriodEnd: new Date('2024-12-23'),
		state: 'Active',
		images: [airpodsImg],
		createdAt: new Date('2024-08-06'),
		updatedAt: new Date('2024-08-06'),
	},
	{
		id: '7',
		title: 'Camping Tent',
		description:
			'4-person camping tent with easy setup. Great for weekend camping trips.',
		category: 'Sports & Outdoors',
		location: 'Philadelphia, PA',
		sharingPeriodStart: new Date('2024-08-11'),
		sharingPeriodEnd: new Date('2024-12-23'),
		state: 'Active',
		images: [tentImg],
		createdAt: new Date('2024-08-07'),
		updatedAt: new Date('2024-08-07'),
	},
	{
		id: '8',
		title: 'Desk Lamp',
		description:
			'Adjustable LED desk lamp with multiple brightness settings. Perfect for studying or working.',
		category: 'Home & Garden',
		location: 'Philadelphia, PA',
		sharingPeriodStart: new Date('2024-08-11'),
		sharingPeriodEnd: new Date('2024-12-23'),
		state: 'Active',
		images: [deskLampImg],
		createdAt: new Date('2024-08-08'),
		updatedAt: new Date('2024-08-08'),
	},
	{
		id: '9',
		title: 'Portable Fan',
		description:
			'Quiet portable fan with multiple speed settings. Great for hot summer days.',
		category: 'Electronics',
		location: 'Philadelphia, PA',
		sharingPeriodStart: new Date('2024-08-11'),
		sharingPeriodEnd: new Date('2024-12-23'),
		state: 'Active',
		images: [fanImg],
		createdAt: new Date('2024-08-09'),
		updatedAt: new Date('2024-08-09'),
	},
	{
		id: '10',
		title: 'Garden Hammock',
		description:
			'Comfortable hammock perfect for relaxing in the garden or backyard.',
		category: 'Home & Garden',
		location: 'Philadelphia, PA',
		sharingPeriodStart: new Date('2024-08-11'),
		sharingPeriodEnd: new Date('2024-12-23'),
		state: 'Active',
		images: [hammockImg],
		createdAt: new Date('2024-08-10'),
		updatedAt: new Date('2024-08-10'),
	},
	{
		id: '11',
		title: 'Comfortable Armchair',
		description:
			'Ergonomic armchair perfect for reading or relaxing. Great condition.',
		category: 'Home & Garden',
		location: 'Philadelphia, PA',
		sharingPeriodStart: new Date('2024-08-11'),
		sharingPeriodEnd: new Date('2024-12-23'),
		state: 'Active',
		images: [armchairImg],
		createdAt: new Date('2024-08-11'),
		updatedAt: new Date('2024-08-11'),
	},
	{
		id: '12',
		title: 'Bubble Chair',
		description:
			'Unique bubble-style hanging chair. Perfect statement piece for any room.',
		category: 'Home & Garden',
		location: 'Philadelphia, PA',
		sharingPeriodStart: new Date('2024-08-11'),
		sharingPeriodEnd: new Date('2024-12-23'),
		state: 'Active',
		images: [bubbleChairImg],
		createdAt: new Date('2024-08-12'),
		updatedAt: new Date('2024-08-12'),
	},
	{
		id: '13',
		title: 'Projector',
		description: 'HD projector for movie nights and presentations.',
		category: 'Electronics',
		location: 'Philadelphia, PA',
		sharingPeriodStart: new Date('2024-08-13'),
		sharingPeriodEnd: new Date('2024-12-23'),
		state: 'Active',
		images: [projectorImg],
		createdAt: new Date('2024-08-13'),
		updatedAt: new Date('2024-08-13'),
	},
	{
		id: '14',
		title: 'Sewing Machine',
		description: 'Easy-to-use sewing machine for beginners and pros.',
		category: 'Home & Garden',
		location: 'Philadelphia, PA',
		sharingPeriodStart: new Date('2024-08-14'),
		sharingPeriodEnd: new Date('2024-12-23'),
		state: 'Active',
		images: [sewingMachineImg],
		createdAt: new Date('2024-08-14'),
		updatedAt: new Date('2024-08-14'),
	},
	{
		id: '15',
		title: 'Kids Backpack',
		description: 'Colorful backpack for school or travel.',
		category: 'Kids & Baby',
		location: 'Philadelphia, PA',
		sharingPeriodStart: new Date('2024-08-15'),
		sharingPeriodEnd: new Date('2024-12-23'),
		state: 'Active',
		images: [backpackImg],
		createdAt: new Date('2024-08-15'),
		updatedAt: new Date('2024-08-15'),
	},
	{
		id: '16',
		title: 'Umbrella',
		description: 'Large umbrella for rainy days or sunny outings.',
		category: 'Miscellaneous',
		location: 'Philadelphia, PA',
		sharingPeriodStart: new Date('2024-08-16'),
		sharingPeriodEnd: new Date('2024-12-23'),
		state: 'Active',
		images: [umbrellaImg],
		createdAt: new Date('2024-08-16'),
		updatedAt: new Date('2024-08-16'),
	},
	{
		id: '17',
		title: 'Reading Lamp',
		description: 'LED reading lamp with adjustable brightness.',
		category: 'Home & Garden',
		location: 'Philadelphia, PA',
		sharingPeriodStart: new Date('2024-08-17'),
		sharingPeriodEnd: new Date('2024-12-23'),
		state: 'Active',
		images: [deskLampImg],
		createdAt: new Date('2024-08-17'),
		updatedAt: new Date('2024-08-17'),
	},
	{
		id: '18',
		title: 'Bluetooth Speaker',
		description: 'Portable Bluetooth speaker with great sound.',
		category: 'Electronics',
		location: 'Philadelphia, PA',
		sharingPeriodStart: new Date('2024-08-18'),
		sharingPeriodEnd: new Date('2024-12-23'),
		state: 'Active',
		images: [fanImg],
		createdAt: new Date('2024-08-18'),
		updatedAt: new Date('2024-08-18'),
	},
	{
		id: '19',
		title: 'Garden Tools Set',
		description: 'Complete set of tools for gardening.',
		category: 'Home & Garden',
		location: 'Philadelphia, PA',
		sharingPeriodStart: new Date('2024-08-19'),
		sharingPeriodEnd: new Date('2024-12-23'),
		state: 'Active',
		images: [armchairImg],
		createdAt: new Date('2024-08-19'),
		updatedAt: new Date('2024-08-19'),
	},
	{
		id: '20',
		title: 'Hammock Stand',
		description: 'Sturdy stand for your garden hammock.',
		category: 'Home & Garden',
		location: 'Philadelphia, PA',
		sharingPeriodStart: new Date('2024-08-20'),
		sharingPeriodEnd: new Date('2024-12-23'),
		state: 'Active',
		images: [hammockImg],
		createdAt: new Date('2024-08-20'),
		updatedAt: new Date('2024-08-20'),
	},
];

const meta: Meta<typeof ListingsGrid> = {
	title: 'Organisms/ListingsGrid',
	component: ListingsGrid,
	parameters: {
		layout: 'fullscreen',
	},
};

export default meta;
type Story = StoryObj<typeof ListingsGrid>;

export const Default: Story = {
	render: (args) => <ListingsGrid {...args} />,
	args: {
		listings: DUMMY_LISTINGS,
		onListingClick: (listing) => console.log('Clicked listing:', listing.title),
	},
};

export const WithPagination: Story = {
	render: (args) => {
		function WithPaginationComponent(props: typeof args) {
			const [currentPage, setCurrentPage] = useState(1);
			const pageSize = 8;
			// Guard: ensure listings is always an array
			const listingsArr = Array.isArray(args.listings) ? args.listings : [];
			const pagedListings = listingsArr.slice(
				(currentPage - 1) * pageSize,
				currentPage * pageSize,
			);
			return (
				<ListingsGrid
					{...props}
					listings={pagedListings}
					total={listingsArr.length}
					currentPage={currentPage}
					pageSize={pageSize}
					onListingClick={(listing) =>
						console.log('Clicked listing:', listing.title)
					}
					onPageChange={(page) => setCurrentPage(page)}
				/>
			);
		}
		return <WithPaginationComponent {...args} />;
	},
};

export const Empty: Story = {
	render: (args) => <ListingsGrid {...args} />,
	args: {
		listings: [],
		onListingClick: (listing) => console.log('Clicked listing:', listing.title),
	},
};
