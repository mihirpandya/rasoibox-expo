import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { AuthDetails } from '../components/common/AuthShim';
import { rasoiBoxYellow } from '../constants/Colors';

const ICON_SIZE: number = 25

interface LeftMenuProps {
    authDetails: AuthDetails | undefined,
    onNav: () => void
}

interface MenuItemEntry {
    label: any,
    icon: any,
    href: any
}

function mergeLists(beginning: any[], middle: any[], end: any[]): any[] {
    let result: any[] = [];
    beginning.forEach(item => result.push(item))
    middle.forEach(item => result.push(item))
    end.forEach(item => result.push(item))
    return result;
}

function getMenuItemEntries(authDetails: AuthDetails | undefined): MenuItemEntry[] {
    const unchanged: MenuItemEntry[] = [
        {
            label: 'Menu',
            icon: <Ionicons name='fast-food' style={styles.menuIcon} size={ICON_SIZE} />,
            href: '/menu'
        },
        {
            label: 'Refer a Friend',
            icon: <Ionicons name='person-add' style={styles.menuIcon} size={ICON_SIZE} />,
            href: '/refer'
        },
        {
            label: 'Our Story',
            icon: <Ionicons name='compass-outline' style={styles.menuIcon} size={ICON_SIZE} />,
            href: '/our-story'
        },
        {
            label: 'Blog',
            icon: <Ionicons name='book' style={styles.menuIcon} size={ICON_SIZE} />,
            href: 'https://rasoibox.substack.com/'
        },
    ]

    let data;

    if (authDetails?.authenticated) {
        let beginning: MenuItemEntry[] = [
            {
                label: 'Start Cooking',
                icon: <MaterialCommunityIcons style={styles.menuIcon} name="silverware-clean" size={ICON_SIZE} color={rasoiBoxYellow} />,
                href: '/startcooking'
            },
            {
                label: 'Profile',
                icon: <Ionicons name='person-circle' style={styles.menuIcon} size={ICON_SIZE} />,
                href: '/profile'
            },
            {
                label: 'Order History',
                icon: <Ionicons name='receipt-outline' style={styles.menuIcon} size={ICON_SIZE} />,
                href: "/order-history"
            }
        ]

        let end: MenuItemEntry[] = [
            {
                label: 'Sign Out',
                icon: <Ionicons name='exit' style={styles.menuIcon} size={ICON_SIZE} />,
                href: '/signout'
            }
        ];

        data = mergeLists(beginning, unchanged, end)
    } else {
        let beginning: MenuItemEntry[] = [
            {
                label: 'Sign In',
                icon: <Ionicons name='enter' style={styles.menuIcon} size={ICON_SIZE} />,
                href: '/signin'
            }
        ]

        data = mergeLists(beginning, unchanged, [])
    }

    return data;
}

function MenuItem(props: {name: any, icon: React.ReactNode, href: any, onNav: () => void}) {
    return (
        <Pressable onPress={() => {
            props.onNav();
            if (props.href.startsWith('/')) {
                window.open(props.href, "_self");
            } else {
                window.open(props.href)
            }
        }}>
            <View style={styles.menuItem}>
                {props.icon}
                <Text style={styles.menuText}>{props.name}</Text>
            </View>
        </Pressable>
    )
}

export default function LeftMenu(props: LeftMenuProps) {
    const { authDetails, onNav } = props;
    const data = getMenuItemEntries(authDetails);

    return (
        <FlatList
            data={data}
            renderItem={
                ({item}) => <MenuItem 
                    name={item.label} 
                    icon={item.icon} 
                    href={item.href} 
                    onNav={onNav} />
            }
        />
    );
}

const styles = StyleSheet.create({
    menuItem: {
        width: '100%',
        flexDirection: 'row',
        borderBottomWidth: 1,
        textAlign: 'left',
    },
    menuText: {
        fontSize: 17,
        fontFamily: 'AvenirLight',
        padding: 20,
        paddingLeft: 0
    },
    menuIcon: {
        padding: 20,
        color: rasoiBoxYellow,
    }
});