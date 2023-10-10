import { createContext, useContext, useEffect, useState } from "react";
import { CustomerInfo, PurchasesPackage, LOG_LEVEL } from "react-native-purchases"
import { Platform, Alert } from "react-native";
import Purchases from "react-native-purchases";


const APIKeys = {
    apple: APPLE_API
}

interface RevenueCatProps {
    purchasePackage? : (pack: PurchasesPackage) => Promise<void>;
    restorePermissions?: () => Promise<CustomerInfo>;
    user: UserState;
    packages: PurchasesPackage[];
}

export interface UserState {
    cookies: number;
    items: string[];
    pro: boolean;
}

const RevenueCatContext = createContext<RevenueCatProps | null>(null);

export const useRevenueCat = () => {
    return useContext(RevenueCatContext) as RevenueCatProps;
}

export const RevenueCatProvider = ({children} : any) => {
    const [user, setUser] = useState<UserState>({cookies: 0, items: [], pro: false});
    const [packages, setPackages] = useState<PurchasesPackage[]>([]);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const init = async () => {
            if (Platform.OS === 'ios') {
                await Purchases.configure({apiKey : APIKeys.apple});
            }
            setIsReady(true);

            Purchases.setLogLevel(LOG_LEVEL.DEBUG);

            Purchases.addCustomerInfoUpdateListener(async (info) => {
                updateCustomerInformation(info);
            });

            await loadOfferings();
        };

        init();
    }, []);


    const loadOfferings = async () => {
        const offerings = await Purchases.getOfferings();
        if (offerings.current) {
            setPackages(offerings.current.availablePackages);
        }
    };


    const updateCustomerInformation = async (customerInfo: CustomerInfo) => {
        const newUser: UserState = { cookies: user.cookies, items: [], pro: false};

        if (customerInfo?.entitlements.active['premium'] !== undefined) {
            newUser.pro = true;
        }

        setUser(newUser);
    };

    
    const purchasePackage = async (pack: PurchasesPackage) => {
        try {
            await Purchases.purchasePackage(pack);
        } catch (e : any) {
            if (!e.userCancelled) {
                Alert.alert(e);
            }
        }
    };


    const restorePermissions = async () => {
        const customer = await Purchases.restorePurchases();
        return customer;
    };


    const value = {
        restorePermissions,
        user,
        packages,
        purchasePackage
    };


    if (!isReady) return <></>;

    return <RevenueCatContext.Provider value={value}>{children}</RevenueCatContext.Provider>


}
