package com.shanhou.fitnesshealthapp.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import kotlinx.coroutines.delay

data class WorkoutType(val icon: String, val name: String, val caloriesPerMin: Int)

val workoutTypes = listOf(
    WorkoutType("🏃", "跑步", 10),
    WorkoutType("🚶", "步行", 4),
    WorkoutType("🚴", "骑行", 8),
    WorkoutType("💪", "力量", 6),
    WorkoutType("🧘", "瑜伽", 3),
    WorkoutType("⭐", "其他", 5)
)

@Composable
fun WorkoutScreen() {
    var selectedType by remember { mutableStateOf(workoutTypes[0]) }
    var isActive by remember { mutableStateOf(false) }
    var elapsedSeconds by remember { mutableStateOf(0) }
    
    LaunchedEffect(isActive) {
        while (isActive) {
            delay(1000)
            elapsedSeconds++
        }
    }
    
    val formattedTime = remember(elapsedSeconds) {
        val hours = elapsedSeconds / 3600
        val minutes = (elapsedSeconds % 3600) / 60
        val seconds = elapsedSeconds % 60
        "%02d:%02d:%02d".format(hours, minutes, seconds)
    }
    
    val caloriesBurned = (elapsedSeconds / 60f * selectedType.caloriesPerMin).toInt()
    
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
            .padding(16.dp)
    ) {
        if (!isActive) {
            Text(
                "选择运动类型",
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold,
                modifier = Modifier.padding(bottom = 16.dp)
            )
            
            LazyVerticalGrid(
                columns = GridCells.Fixed(3),
                horizontalArrangement = Arrangement.spacedBy(12.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp),
                modifier = Modifier.weight(1f)
            ) {
                items(workoutTypes) { type ->
                    Card(
                        modifier = Modifier
                            .aspectRatio(1f)
                            .clickable { selectedType = type },
                        colors = CardDefaults.cardColors(
                            containerColor = if (selectedType == type)
                                MaterialTheme.colorScheme.primaryContainer
                            else MaterialTheme.colorScheme.surface
                        ),
                        border = if (selectedType == type)
                            CardDefaults.outlinedCardBorder()
                        else null
                    ) {
                        Column(
                            modifier = Modifier
                                .fillMaxSize()
                                .padding(8.dp),
                            horizontalAlignment = Alignment.CenterHorizontally,
                            verticalArrangement = Arrangement.Center
                        ) {
                            Text(type.icon, fontSize = 36.sp)
                            Spacer(modifier = Modifier.height(4.dp))
                            Text(type.name, fontWeight = FontWeight.SemiBold)
                            Text(
                                "~${type.caloriesPerMin}卡/分",
                                fontSize = 10.sp,
                                color = Color.Gray
                            )
                        }
                    }
                }
            }
            
            Spacer(modifier = Modifier.height(16.dp))
            
            Button(
                onClick = { isActive = true },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(56.dp),
                colors = ButtonDefaults.buttonColors(
                    containerColor = MaterialTheme.colorScheme.primary
                )
            ) {
                Text("▶ 开始运动", fontSize = 18.sp)
            }
        } else {
            Column(
                modifier = Modifier.fillMaxSize(),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.Center
            ) {
                Text(selectedType.icon, fontSize = 64.sp)
                Text(
                    selectedType.name,
                    fontSize = 24.sp,
                    fontWeight = FontWeight.Bold,
                    modifier = Modifier.padding(top = 12.dp)
                )
                
                Spacer(modifier = Modifier.height(32.dp))
                
                Text("运动时间", color = Color.Gray)
                Text(
                    formattedTime,
                    fontSize = 64.sp,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.primary
                )
                
                Spacer(modifier = Modifier.height(24.dp))
                
                Row(
                    horizontalArrangement = Arrangement.spacedBy(48.dp)
                ) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text("$caloriesBurned", fontSize = 36.sp, fontWeight = FontWeight.Bold)
                        Text("卡路里", color = Color.Gray)
                    }
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text("${elapsedSeconds / 60}", fontSize = 36.sp, fontWeight = FontWeight.Bold)
                        Text("分钟", color = Color.Gray)
                    }
                }
                
                Spacer(modifier = Modifier.height(48.dp))
                
                Button(
                    onClick = {
                        isActive = false
                        elapsedSeconds = 0
                    },
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(56.dp),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = Color(0xFFF44336)
                    )
                ) {
                    Text("⬛ 结束运动", fontSize = 18.sp)
                }
                
                Spacer(modifier = Modifier.height(16.dp))
                
                Card(
                    colors = CardDefaults.cardColors(
                        containerColor = Color(0xFFFFF9C4)
                    )
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Text("💡 运动提示", fontWeight = FontWeight.SemiBold, color = Color(0xFFF57F17))
                        Text(
                            "保持均匀呼吸，注意补充水分。如感到不适请立即停止运动。",
                            fontSize = 14.sp,
                            color = Color.Gray
                        )
                    }
                }
            }
        }
    }
}
