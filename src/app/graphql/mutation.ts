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

export const verifyDemand = gql`
	mutation verifyDemand($id:ID!, $user:ID!){
		verifyDemand(id:$id, user: $user){
			verified
			verifiedBy{
				name
				email
				phone
			}
		}
	}
`;

export const closeDemand = gql`
	mutation closeDemand($id:ID!, $user:ID!){
		closeDemand(id:$id, user: $user){
			closed
			closedBy{
				name
				email
				phone
			}
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

export const verifySupply = gql`
	mutation verifySupply($id:ID!, $user:ID!){
		verifySupply(id:$id, user: $user){
			verified
			verifiedBy{
				name
				email
				phone
			}
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

export const verifyActivity = gql`
	mutation verifyActivity($id:ID!, $user:ID!){
		verifyActivity(id:$id, user: $user){
			verified
			verifiedBy{
				name
				email
				phone
			}
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

export const verifyDemography = gql`
	mutation verifyDemography($id:ID!, $user:ID!){
		verifyDemography(id:$id, user: $user){
			verified
			verifiedBy{
				name
				email
				phone
			}
		}
	}
`;