import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, Image, StyleSheet} from 'react-native';

export default class AddPlan extends Component {
  constructor(props) {
    super(props);
    this.state = {
        isVisible:false,
        selected:null,
    };
  }


  onHandle = (item) =>{
    this.setState({
        selected:item,
        isVisible:false,
    })
  }


  render() {
    const data = [
        {
            id:1,
            name:"Liseye Geçiş Sınavı (LGS)",
        },
        {
            id:2,
            name:"Yükseköğretim Kurumları Sınavı (YKS)",
        },
        {
            id:3,
            name:"Kamu Personeli Seçme Sınavı (KPSS)",
        },
        {
            id:4,
            name:"Dikey Geçiş Sınavı (DGS)",
        },
        {
            id:5,
            name:"Akademik Personel ve Lisansüstü Sınavı (ALES)",
        },
        
    ]

    return (
      <View style={{padding:'5%'}} >
        <View style={{
            backgroundColor:"#A8DEFF",
            width:'100%',
            height:'31%',
            borderRadius:20,
            shadowColor: "#000",
                  shadowOffset: {
                    width: 0,
                    height:2,
                  },
                  shadowOpacity: 0.50,
                  shadowRadius: 20,
            }}>
            <TouchableOpacity style={{
                backgroundColor:'white', 
                width:50, 
                height:50, 
                borderRadius:25,
                right:-5,
                top: 5
            }}
                onPress={()=>this.setState({isVisible:true})}
            >  
                <Image
                    source={require("../assest/arrow.png")}
                    style={{width:30, height:30, right:-10, top:10}}
                    resizeMode="contain"
                />
            </TouchableOpacity>
            
            <Text style={{fontSize:16, color:"#003351", right:-70, top: -37}}>Çalıştığınız Sınav</Text>
            <Text style={{fontSize:14, color:"#003351", right:-70, top: -33}}>Seçmek için dokunun.</Text>
        </View>
        <View>
            { this.state.selected !== null &&
                <Text>
                    {this.state.selected.name}      
                </Text>
            }
        </View>


        <Modal 
            visible={this.state.isVisible}
            transparent={true}
        >
            <View 
                style={{
                    backgroundColor:'rgba(0,0,0,0.5)',
                    flex:1,
                    width:'100%',
                    justifyContent:'flex-end'
                }}
            >
                <View style={{height:'40%', width:'100%', backgroundColor:"white"}}>
                    <ScrollView>
                    {data.map((item, key)=>(
                        <TouchableOpacity key={key} style={{
                            width:'100%', height:70, backgroundColor:"white",
                            alignItems:'center',
                            justifyContent:'center'
                        }} 
                            onPress={()=>this.onHandle(item)}
                        >
                            <Text style={{fontSize:16, top:10}}>
                                {item.name}
                            </Text>
                        </TouchableOpacity>
                    ))}
                    </ScrollView>
                </View>
            </View>

        </Modal>
      </View>
    );
  }
}
