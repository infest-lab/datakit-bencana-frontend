import gql from 'graphql-tag';

export const createUser = gql`
	mutation createUser($input:UserInput!){
		createUser(input:$input){						
			name
			email
			phone
			profile{
				gender
				nickname
				picture
				sub
			}
			verified			
			createdAt			
			modifiedAt
		}
	}
`;

export const addDemand = gql`
	mutation addDemand($input:DemandInput!){
		addDemand(input:$input){					
			name
		}
	}
`;

export const addSupply = gql`
	mutation addSupply($input:SupplyInput!){
		addSupply(input:$input){					
			name
		}
	}
`;

export const addActivity = gql`
	mutation addActivity($input:ActivityInput!){
		addActivity(input:$input){					
			name
		}
	}
`;

export const addDemography = gql`
	mutation addDemography($input:DemographyInput!){
		addDemography(input:$input){					
			male
		}
	}
`;