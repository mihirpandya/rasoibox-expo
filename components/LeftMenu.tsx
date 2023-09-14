import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { AuthDetails } from '../components/common/AuthShim';
import { rasoiBoxYellow } from '../constants/Colors';

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
            icon: 'fast-food',
            href: '/menu'
        },
        {
            label: 'Our Story',
            icon: 'compass-outline',
            href: '/our-story'
        },
        {
            label: 'Blog',
            icon: 'book',
            href: '/blog'
        },
        {
            label: 'Refer a Friend',
            icon: 'person-add',
            href: '/refer-a-friend'
        },
    ]

    let data;

    if (authDetails?.authenticated) {
        let beginning: MenuItemEntry[] = [
            {
                label: 'Profile',
                icon: 'person-circle',
                href: '/profile'
            },
            {
                label: 'Order History',
                icon: "receipt-outline",
                href: "/order-history"
            }
        ]

        let end: MenuItemEntry[] = [
            {
                label: 'Sign Out',
                icon: 'exit',
                href: '/signout'
            }
        ];

        data = mergeLists(beginning, unchanged, end)
    } else {
        let beginning: MenuItemEntry[] = [
            {
                label: 'Sign In',
                icon: 'enter',
                href: '/signin'
            }
        ]

        data = mergeLists(beginning, unchanged, [])
    }

    return data;
}

function MenuItem(props: {name: any, iconName: any, href: any, onNav: () => void}) {
    return (
        <Pressable onPress={() => {
            props.onNav();
            router.replace(props.href);
        }}>
            <View style={styles.menuItem}>
                <Ionicons name={props.iconName} style={styles.menuIcon} size={25} />
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
                    iconName={item.icon} 
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
        fontSize: 20,
        fontFamily: 'AvenirLight',
        padding: 20
    },
    menuIcon: {
        padding: 20,
        color: rasoiBoxYellow,
    }
});