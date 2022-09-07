import {
	Accordion,
	AccordionSummary,
	AccordionDetails,
	Typography,
	Box,
	Grid,
	IconButton,
	InputBase,
	Paper,
	Stack,
	styled,
	List,
	ListItemButton,
	Avatar,
	ListItemText,
	MenuItem,
	Select,
} from '@mui/material';
import { useCallback, useEffect } from 'react';
import { memo, useState } from 'react';
import CommonTabs from '../../components/CommonTabs';
import SearchIcon from '@mui/icons-material/Search';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import GroupAddIcon from '@mui/icons-material/GroupAdd';
import AddChatDialog from '../../components/Chat/AddChatDialog';
import { CollectionsBookmarkOutlined } from '@mui/icons-material';
import { useRouter } from 'next/router';
import { useWalletInfo } from '../../providers/wallet';

const ChatHeader = styled(Paper)(() => ({
	display: 'flex',
	justifyContent: 'space-between',
}));

const GridWrapper = styled(Grid)(() => ({
	height: '81vh',
	borderRadius: '12px',
	boxShadow:
		'0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)',
}));

const LeftBox = styled(Box)(() => ({
	height: '100%',
	width: '260px',
	background: 'white',
	borderRadius: '12px 0 0 12px',
	// padding: "16px 20px",
	borderRight: '1px solid #ddd',
}));

const RightBox = styled(Box)(() => ({
	height: '100%',
	width: 'calc(100vw - 623px)',
	background: 'white',
	borderRadius: '0 12px 12px 0',
	padding: '16px 20px',
	borderLeft: '1px solid #ddd',
}));

// const AccordionWrapper = styled(Accordion)(() => ({
//   padding: "0",

//   ":before": {
//     height: 0,
//   },

//   "& .MuiAccordionSummary-root": {
//     padding: "0 12px",
//     minHeight: "unset",

//     borderBottom: "1px solid #ddd",
//   },

//   "& .MuiAccordionSummary-root .Mui-expanded": {
//     margin: "12px 0px",
//   },

//   "& .MuiAccordionDetails-root": {
//     padding: "0",
//   },

//   "& .MuiListItemButton-root": {
//     gap: "10px",
//   },
// }));

const RelationListWrapper = styled(Box)(() => ({
	height: '100%',
	overflowY: 'auto',
	'.MuiTypography-subtitle1': {
		padding: '16px 20px',
		fontSize: '15px',
		fontWeight: 500,
	},
}));

const RelationList = styled(List)(() => ({
	padding: '0',
	'.MuiListItemButton-root': {
		padding: '8px 16px',
		gap: '10px',
	},
}));

const SelectWrapper = styled(Select)(() => ({
	border: '1px solid #9a9a9a',
	borderRadius: '12px',
	margin: '10px',
	textAlign: 'right',
	'.MuiOutlinedInput-notchedOutline': {
		border: 'none',
	},

	'.MuiSelect-select': {
		padding: '0px',
		borderRadius: '12px',
	},
}));

export async function getStaticPaths() {
	return {
		fallback: 'blocking',
		paths: [
			{
				params: {
					name: ['', ''],
				},
			},
		],
	};
}

export async function getStaticProps({ params }) {
	const { name } = params;
	return {
		props: {
			// ...params,
			type: name[0] === 'friend' ? 0 : 1,
		},
	};
}

const Chat = ({ type }) => {
	const [tabValue, setTabValue] = useState(type);
	const [selectItem, setSelectItem] = useState('all');
	const [addOpen, setAddOpen] = useState(false);
	const [conversations, setConversations] = useState(null);
	const [chatList, setChatList] = useState([]);

	const isFriend = tabValue === 0 ? true : false;

	const router = useRouter();

	const handleChangeTabs = useCallback(
		(e, newValue) => {
			setTabValue(newValue);
			if (newValue === 0) {
				console.log('newValue:', newValue);
				router.push(`/Chat/Friend`);
			}
			if (newValue === 1) {
				router.push(`/Chat/Group`);
			}
		},
		[router]
	);

	const handleSelectChange = useCallback((e) => {
		setSelectItem(e.target.value);
	}, []);

	const tabList = ['Friend', 'Group'];

	const { client } = useWalletInfo();

	const startClient = useCallback(async () => {
		if (client) {
			const newConversation = await client.conversations.newConversation(
				'0x9F1C13F59392fA9B0E1cCDD2386eCc9B2048DED2'
			);
			setConversations(newConversation);
			const m = await newConversation.messages();
			setChatList([...m]);
			listenChatList();
		}
	}, [client, listenChatList]);

	const listenChatList = useCallback(async () => {
		if (!conversations) return;
		for await (const message of await conversations.streamMessages()) {
			if (message.senderAddress === xmtp.address) {
				// This message was sent from me
				console.log(message, 'in the message');
				setChatList((v) => [...v, { ...message }]);
				continue;
			}
		}
	}, [conversations]);

	const sendMessages = useCallback(
		(msg) => {
			if (msg && conversations) {
				console.log(msg, 'send msg', conversations, conversations.send);
				conversations.send(msg);
			}
		},
		[conversations]
	);

	useEffect(() => {
		startClient();
	}, [startClient]);

	return (
		<Stack direction="column" spacing={2}>
			<ChatHeader>
				<CommonTabs
					tabValue={tabValue}
					tabList={tabList}
					handleChange={handleChangeTabs}
				/>
				<Stack direction="row" spacing={1} p={0} alignItems="center">
					<InputBase
						placeholder={
							tabValue === 0 ? 'Search friend Name' : 'Search group name'
						}
						sx={{ height: '40px', paddingRight: '0px' }}
						endAdornment={
							<IconButton sx={{ borderRadius: '12px' }}>
								<SearchIcon />
							</IconButton>
						}
					/>
					<IconButton
						onClick={() => {
							setAddOpen(true);
						}}
					>
						<GroupAddIcon />
					</IconButton>
				</Stack>
			</ChatHeader>

			<Grid container>
				<GridWrapper item>
					<LeftBox>
						{/* <AccordionWrapper defaultExpanded={true}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel2a-content"
                id="panel2a-header"
              >
                <Typography>Message</Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ overflowY: "auto" }}>
                <List component="nav">
                  {[0, 1, 2, 3].map((item) => (
                    <ListItemButton key={item}>
                      <Avatar />
                      <ListItemText
                        primary="liujuncheng.key"
                        secondary="Jan 9, 2014"
                      />
                    </ListItemButton>
                  ))}
                </List>
              </AccordionDetails>
            </AccordionWrapper> */}

						<RelationListWrapper>
							<Stack direction="row" p={0} justifyContent="space-between">
								<Typography variant="subtitle1">
									{isFriend ? 'Friend' : 'Group'}
								</Typography>

								<SelectWrapper value={selectItem} onChange={handleSelectChange}>
									<MenuItem value="all">All</MenuItem>
									<MenuItem value="my">My</MenuItem>
									<MenuItem value="his">His</MenuItem>
								</SelectWrapper>
							</Stack>
							<RelationList component="nav">
								{[0, 1, 2, 3, , 4, 5, 6, 7, 8, 9, 10, 11].map((item) => (
									<ListItemButton key={item}>
										<Avatar />
										<ListItemText
											primary="liujuncheng.key"
											secondary="Jan 9, 2014"
										/>
									</ListItemButton>
								))}
							</RelationList>
						</RelationListWrapper>
					</LeftBox>
				</GridWrapper>
				<GridWrapper item xs="auto">
					<RightBox>
						<ul>
							{chatList.map((item) => (
								<li key={item.id}>{item.content}</li>
							))}
						</ul>
						<div
							onClick={sendMessages.bind(this, 'hello world')}
							style={{ cursor: 'pointer' }}
						>
							send a message
						</div>
					</RightBox>
				</GridWrapper>
			</Grid>

			<AddChatDialog
				open={addOpen}
				type={tabValue}
				onClose={() => {
					setAddOpen(false);
				}}
			/>
		</Stack>
	);
};

export default memo(Chat);
