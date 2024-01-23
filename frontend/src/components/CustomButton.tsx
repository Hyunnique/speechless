import React, { ReactNode } from 'react';
import classNames from 'classnames';

interface CustomButtonProps {
	children: ReactNode;
	size?: 'sm' | 'md' | 'lg';
	color?:
		| 'primary'
		| 'positive'
		| 'negative'
		| 'white'
		| 'red'
		| 'yellow'
		| 'green'
		| 'blue'
		| 'indigo'
		| 'purple'
		| 'pink'
		| 'google'
		| 'kakao'
		| 'naver';
	bordered?: boolean;
	className?: string;
	onClick?: () => void;
}

export const CustomButton: React.FC<CustomButtonProps> = (props: CustomButtonProps) => {
	const {
		children,
		size = 'md',
		color = 'white',
		bordered = false,
		className = undefined,
		onClick = undefined,
	} = props;

	const sizeClassName = size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : 'text-lg';
	const colorClassName =
		color === 'primary'
			? 'bg-primary-100 text-primary-800 border-primary-300 hover:bg-primary-50'
			: color === 'positive'
				? 'bg-positive-100 text-positive-800 border-positive-300 hover:bg-positive-50'
				: color === 'negative'
					? 'bg-negative-500 text-negative-50 border-negative-500 hover:bg-negative-600'
					: color === 'red'
						? 'bg-red-100 text-red-800 border-red-300 hover:bg-red-50'
						: color === 'yellow'
							? 'bg-yellow-100 text-yellow-800 border-yellow-300 hover:bg-yellow-50'
							: color === 'green'
								? 'bg-green-100 text-green-800 border-green-300 hover:bg-green-50'
								: color === 'blue'
									? 'bg-blue-100 text-blue-800 border-blue-300 hover:bg-blue-50'
									: color === 'indigo'
										? 'bg-indigo-100 text-indigo-800 border-indigo-300 hover:bg-indigo-50'
										: color === 'purple'
											? 'bg-purple-100 text-purple-800 border-purple-300 hover:bg-purple-50'
											: color === 'pink'
												? 'bg-pink-100 text-pink-800 border-pink-300 hover:bg-pink-50'
												: color === 'google'
													? 'bg-white text-gray-800 border-gray-300 hover:bg-gray-50'
													: color === 'kakao'
														? 'bg-[#FFE812] text-yellow-800 border-yellow-300 hover:bg-opacity-70'
														: color === 'naver'
															? 'bg-[#1EDE00] text-green-800 border-green-300 hover:bg-opacity-70'
															: 'bg-white text-gray-800 border-gray-300 hover:bg-gray-50';
	const borderedClassName = bordered ? 'border' : '';

	return (
		<button
			className={classNames(
				'font-medium px-4 py-1 rounded-md',
				sizeClassName,
				colorClassName,
				borderedClassName,
				className
			)
		} onClick={onClick}>
			{ children }
		</button>
	);
};
