import { Card } from 'flowbite-react';
import React, { ReactNode } from 'react';
import {CustomButton} from "./CustomButton.tsx";
import classNames from "classnames";

interface TitledCardProps {
	children: ReactNode;
	title: string;
	className?: string;
	buttonLabel?: string;
	buttonOnClick?: () => void;
}

export const TitledCard: React.FC<TitledCardProps> = ({ children, title, className, buttonLabel, buttonOnClick }) => {
	return (
		<Card className={classNames(
			'bg-gray-50 border-2',
			className
		)}>
			<div className='w-full h-full flex flex-col'>
				<div className={classNames(
					'flex items-center mb-4',
					buttonLabel ? 'justify-between' : 'justify-left',
				)}>
					<p className='text-2xl'>{title}</p>
					{
						buttonLabel ? (
							<CustomButton color='blue' onClick={buttonOnClick}>
								{buttonLabel}
							</CustomButton>
						) : undefined
					}
				</div>

				<div className='flex-1'>{children}</div>
			</div>
		</Card>
	);
};
