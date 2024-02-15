import React, { ReactNode } from 'react';
import classNames from 'classnames';

interface CustomBadgeProps {
	children: ReactNode;
	size?: 'sm' | 'md' | 'lg';
	color?: 'white' | 'gray' | 'red' | 'yellow' | 'green' | 'blue' | 'indigo' | 'purple' | 'pink';
	bordered?: boolean;
	className?: string;
}

export const CustomBadge: React.FC<CustomBadgeProps> = (props: CustomBadgeProps) => {
	const { children, size = 'md', color = 'white', bordered = false, className = undefined } = props;

	const sizeClassName = size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : 'text-lg';
	const colorClassName =
		color === 'white'
			? 'bg-white text-gray-800 border-gray-300'
			: color === 'gray'
				? 'bg-gray-100 text-gray-800 border-gray-300'
				: color === 'red'
					? 'bg-red-100 text-red-800 border-red-300'
					: color === 'yellow'
						? 'bg-yellow-100 text-yellow-800 border-yellow-300'
						: color === 'green'
							? 'bg-green-100 text-green-800 border-green-300'
							: color === 'blue'
								? 'bg-blue-100 text-blue-800 border-blue-300'
								: color === 'indigo'
									? 'bg-indigo-100 text-indigo-800 border-indigo-300'
									: color === 'purple'
										? 'bg-purple-100 text-purple-800 border-purple-300'
										: 'bg-pink-100 text-pink-800 border-pink-300';
	const borderedClassName = bordered ? 'border' : '';

	return (
		<span
			className={classNames(
				'flex items-center font-medium px-2.5 py-0.5 rounded',
				sizeClassName,
				colorClassName,
				borderedClassName,
				className,
			)}
		>
			{children}
		</span>
	);
};
